// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrustLineVault
 * @notice Minimal undercollateralized lending vault on Hedera Testnet for the TrustLine MVP.
 * Enforces loan lifecycle: PENDING -> ACTIVE -> REPAID (or DEFAULTED).
 * Emits audit events on Hedera EVM.
 */
contract TrustLineVault {
    enum LoanStatus {
        PENDING,
        ACTIVE,
        REPAID,
        DEFAULTED
    }

    struct Loan {
        bytes32 loanId;
        address lender;
        address borrower;
        uint256 principal;           // in tinybars/wei
        uint256 installmentAmount;   // in tinybars/wei
        uint256 installmentCount;    // e.g. 3
        uint256 installmentsPaid;   // 0 to 3
        LoanStatus status;
        uint256 createdAt;
        uint256 nextDueAt;
        string credentialHash;       // SHA-256 hash anchored to Hedera HCS
    }

    mapping(bytes32 => Loan) public loans;
    bytes32[] public loanIds;

    // Events
    event LoanCreated(
        bytes32 indexed loanId,
        address indexed lender,
        address indexed borrower,
        uint256 principal,
        string credentialHash
    );

    event LoanFunded(
        bytes32 indexed loanId,
        uint256 amount
    );

    event InstallmentPaid(
        bytes32 indexed loanId,
        uint256 installmentNumber,
        uint256 amountPaid
    );

    event LoanRepaid(
        bytes32 indexed loanId
    );

    event LoanDefaulted(
        bytes32 indexed loanId,
        string reason
    );

    /**
     * @notice Registers a new undercollateralized loan with an anchored TrustLine credential hash.
     */
    function createLoan(
        bytes32 _loanId,
        address _borrower,
        uint256 _principal,
        uint256 _installmentAmount,
        uint256 _installmentCount,
        uint256 _durationSeconds,
        string calldata _credentialHash
    ) external returns (bytes32) {
        require(loans[_loanId].createdAt == 0, "Loan ID already exists");
        require(_borrower != address(0), "Invalid borrower address");
        require(_principal > 0, "Principal must be greater than zero");
        require(_installmentCount > 0, "Installments must be greater than zero");
        require(bytes(_credentialHash).length > 0, "Credential hash required");

        loans[_loanId] = Loan({
            loanId: _loanId,
            lender: msg.sender,
            borrower: _borrower,
            principal: _principal,
            installmentAmount: _installmentAmount,
            installmentCount: _installmentCount,
            installmentsPaid: 0,
            status: LoanStatus.PENDING,
            createdAt: block.timestamp,
            nextDueAt: block.timestamp + _durationSeconds,
            credentialHash: _credentialHash
        });

        loanIds.push(_loanId);

        emit LoanCreated(
            _loanId,
            msg.sender,
            _borrower,
            _principal,
            _credentialHash
        );

        return _loanId;
    }

    /**
     * @notice Funds the loan. The principal is transferred to the borrower.
     */
    function fundLoan(bytes32 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.createdAt > 0, "Loan does not exist");
        require(loan.status == LoanStatus.PENDING, "Loan is not pending funding");
        require(msg.sender == loan.lender, "Only lender can fund this loan");
        require(msg.value >= loan.principal, "Insufficient funding amount sent");

        loan.status = LoanStatus.ACTIVE;

        // Disburse principal to borrower
        (bool sent, ) = payable(loan.borrower).call{value: msg.value}("");
        require(sent, "Failed to disburse funds to borrower");

        emit LoanFunded(_loanId, msg.value);
    }

    /**
     * @notice Creates and funds a loan in a single atomic transaction.
     */
    function createAndFundLoan(
        bytes32 _loanId,
        address _borrower,
        uint256 _installmentAmount,
        uint256 _installmentCount,
        uint256 _durationSeconds,
        string calldata _credentialHash
    ) external payable returns (bytes32) {
        require(loans[_loanId].createdAt == 0, "Loan ID already exists");
        require(_borrower != address(0), "Invalid borrower");
        require(msg.value > 0, "Principal must be > 0");
        require(bytes(_credentialHash).length > 0, "Credential hash required");

        loans[_loanId] = Loan({
            loanId: _loanId,
            lender: msg.sender,
            borrower: _borrower,
            principal: msg.value,
            installmentAmount: _installmentAmount,
            installmentCount: _installmentCount,
            installmentsPaid: 0,
            status: LoanStatus.ACTIVE,
            createdAt: block.timestamp,
            nextDueAt: block.timestamp + _durationSeconds,
            credentialHash: _credentialHash
        });

        loanIds.push(_loanId);

        emit LoanCreated(
            _loanId,
            msg.sender,
            _borrower,
            msg.value,
            _credentialHash
        );

        // Disburse principal to borrower
        (bool sent, ) = payable(_borrower).call{value: msg.value}("");
        require(sent, "Disbursement failed");

        emit LoanFunded(_loanId, msg.value);

        return _loanId;
    }

    /**
     * @notice Repays an installment. Funds are routed directly to the lender.
     */
    function repayInstallment(bytes32 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.createdAt > 0, "Loan does not exist");
        require(loan.status == LoanStatus.ACTIVE, "Loan is not active");
        require(loan.installmentsPaid < loan.installmentCount, "Loan is already fully repaid");
        require(msg.value >= loan.installmentAmount, "Insufficient installment amount sent");

        loan.installmentsPaid += 1;
        uint256 currentInstallment = loan.installmentsPaid;

        // Route repayment directly to the lender
        (bool sent, ) = payable(loan.lender).call{value: msg.value}("");
        require(sent, "Failed to route installment to lender");

        emit InstallmentPaid(_loanId, currentInstallment, msg.value);

        if (loan.installmentsPaid >= loan.installmentCount) {
            loan.status = LoanStatus.REPAID;
            emit LoanRepaid(_loanId);
        }
    }

    /**
     * @notice Marks a loan as defaulted if repayment terms are breached.
     */
    function markDefault(bytes32 _loanId, string calldata _reason) external {
        Loan storage loan = loans[_loanId];
        require(loan.createdAt > 0, "Loan does not exist");
        require(loan.status == LoanStatus.ACTIVE, "Loan is not active");
        require(loan.installmentsPaid < loan.installmentCount, "Cannot default repaid loan");
        require(msg.sender == loan.lender, "Only lender can mark default");

        loan.status = LoanStatus.DEFAULTED;
        emit LoanDefaulted(_loanId, _reason);
    }

    /**
     * @notice Returns loan details.
     */
    function getLoan(bytes32 _loanId) external view returns (
        bytes32 loanId,
        address lender,
        address borrower,
        uint256 principal,
        uint256 installmentAmount,
        uint256 installmentCount,
        uint256 installmentsPaid,
        uint8 status,
        uint256 createdAt,
        uint256 nextDueAt,
        string memory credentialHash
    ) {
        Loan storage loan = loans[_loanId];
        require(loan.createdAt > 0, "Loan does not exist");

        return (
            loan.loanId,
            loan.lender,
            loan.borrower,
            loan.principal,
            loan.installmentAmount,
            loan.installmentCount,
            loan.installmentsPaid,
            uint8(loan.status),
            loan.createdAt,
            loan.nextDueAt,
            loan.credentialHash
        );
    }

    function getLoanCount() external view returns (uint256) {
        return loanIds.length;
    }
}
