import { 
  ContractExecuteTransaction, 
  ContractCallQuery, 
  ContractFunctionParameters, 
  ContractId, 
  Hbar, 
  AccountId 
} from '@hashgraph/sdk';
import { getLenderClient, getBorrowerClient } from './hederaClient';

export interface CreateLoanOnChainInput {
  loanId: string;
  borrowerAccountId?: string;
  principalHbar: number;      // e.g. 5 HBAR
  installmentCount: number;   // 3
  durationSeconds: number;    // e.g. 90 days = 7776000
  credentialHash: string;
}

export interface ContractTransactionReceipt {
  success: boolean;
  contractId: string;
  loanId: string;
  transactionId: string;
  status: string;
  installmentsPaid?: number;
  explorerUrl: string;
  isLive: boolean;
  demoAccountMode?: boolean;
  onChainDetails?: any;
}

export class ServerContractService {
  /**
   * Converts a string loan ID to a 32-byte array for Solidity bytes32 parameter.
   */
  public static stringToBytes32(str: string): Uint8Array {
    const buffer = Buffer.alloc(32);
    buffer.write(str, 0, 32, 'utf8');
    return new Uint8Array(buffer);
  }

  /**
   * Executes createAndFundLoan on the deployed TrustLineVault smart contract from the Lender account.
   * Transfers testnet HBAR as demonstration funds.
   */
  public static async createAndFundLoanOnChain(
    contractIdStr: string,
    input: CreateLoanOnChainInput
  ): Promise<ContractTransactionReceipt> {
    const lender = getLenderClient();
    const borrower = getBorrowerClient();

    if (!lender.isLive || !lender.client) {
      throw new Error(`Hedera client not live: ${lender.error || 'Credentials unconfigured'}`);
    }

    const contractId = ContractId.fromString(contractIdStr);
    const borrowerIdStr = borrower.accountId || lender.accountId || '';
    const isDemoAccountMode = !borrower.isSeparate;

    const borrowerAccountId = AccountId.fromString(borrowerIdStr);
    const borrowerSolidityAddress = borrowerAccountId.toSolidityAddress();

    const loanIdBytes32 = this.stringToBytes32(input.loanId);
    const principalHbar = input.principalHbar || 5;
    const installmentCount = input.installmentCount || 3;
    const durationSeconds = input.durationSeconds || (90 * 24 * 3600);

    const principalTinybars = Hbar.from(principalHbar).toTinybars().toNumber();
    const installmentAmountTinybars = Math.floor(principalTinybars / installmentCount);

    console.log(`[Contract] Executing createAndFundLoan on contract ${contractIdStr} for loan ${input.loanId}...`);
    console.log(`[Contract] Lender: ${lender.accountId} -> Borrower: ${borrowerIdStr}`);

    const params = new ContractFunctionParameters()
      .addBytes32(loanIdBytes32)
      .addAddress(borrowerSolidityAddress)
      .addUint256(installmentAmountTinybars)
      .addUint256(installmentCount)
      .addUint256(durationSeconds)
      .addString(input.credentialHash);

    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(1500000)
      .setFunction('createAndFundLoan', params)
      .setPayableAmount(new Hbar(principalHbar));

    const txResponse = await tx.execute(lender.client);
    const receipt = await txResponse.getReceipt(lender.client);

    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error(`Hedera transaction failed with status: ${receipt.status.toString()}`);
    }

    const txIdString = txResponse.transactionId.toString();
    console.log(`[Contract] createAndFundLoan confirmed on Hedera Testnet: ${txIdString}`);

    // Query on-chain state to confirm
    let onChainDetails = null;
    try {
      await new Promise(r => setTimeout(r, 800));
      onChainDetails = await this.queryLoanOnChain(contractIdStr, input.loanId);
    } catch (e) {
      console.warn('[Contract] Post-funding verification query note:', e);
    }

    return {
      success: true,
      contractId: contractIdStr,
      loanId: input.loanId,
      transactionId: txIdString,
      status: onChainDetails?.status || 'ACTIVE',
      installmentsPaid: onChainDetails?.installmentsPaid ?? 0,
      explorerUrl: `https://hashscan.io/testnet/transaction/${txIdString}`,
      isLive: true,
      demoAccountMode: isDemoAccountMode,
      onChainDetails
    };
  }

  /**
   * Executes repayInstallment on the deployed TrustLineVault contract from the Borrower account.
   * Sends 1/3 of the testnet principal in HBAR directly to the lender.
   */
  public static async repayInstallmentOnChain(
    contractIdStr: string,
    loanIdStr: string,
    installmentAmountHbar: number
  ): Promise<ContractTransactionReceipt> {
    const borrower = getBorrowerClient();

    if (!borrower.isLive || !borrower.client) {
      throw new Error('Borrower client not available');
    }

    const contractId = ContractId.fromString(contractIdStr);
    const loanIdBytes32 = this.stringToBytes32(loanIdStr);
    const hbarAmount = installmentAmountHbar > 0 ? installmentAmountHbar : 1.67;

    console.log(`[Contract] Borrower (${borrower.accountId}) executing repayInstallment for loan ${loanIdStr} (${hbarAmount} HBAR)...`);

    const params = new ContractFunctionParameters()
      .addBytes32(loanIdBytes32);

    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(800000)
      .setFunction('repayInstallment', params)
      .setPayableAmount(new Hbar(hbarAmount));

    const txResponse = await tx.execute(borrower.client);
    const receipt = await txResponse.getReceipt(borrower.client);

    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error(`Repayment transaction failed with status: ${receipt.status.toString()}`);
    }

    const txIdString = txResponse.transactionId.toString();
    console.log(`[Contract] repayInstallment confirmed on Hedera Testnet: ${txIdString}`);

    // Query on-chain state to confirm actual installment count & status
    let onChainDetails = null;
    try {
      await new Promise(r => setTimeout(r, 800));
      onChainDetails = await this.queryLoanOnChain(contractIdStr, loanIdStr);
    } catch (e) {
      console.warn('[Contract] Post-repay verification query note:', e);
    }

    return {
      success: true,
      contractId: contractIdStr,
      loanId: loanIdStr,
      transactionId: txIdString,
      status: onChainDetails?.status || 'INSTALLMENT_PAID',
      installmentsPaid: onChainDetails?.installmentsPaid,
      explorerUrl: `https://hashscan.io/testnet/transaction/${txIdString}`,
      isLive: true,
      onChainDetails
    };
  }

  /**
   * Queries loan status directly from the smart contract on Hedera EVM.
   */
  public static async queryLoanOnChain(
    contractIdStr: string,
    loanIdStr: string
  ): Promise<any> {
    const lender = getLenderClient();
    if (!lender.isLive || !lender.client) {
      return null;
    }

    try {
      const contractId = ContractId.fromString(contractIdStr);
      const loanIdBytes32 = this.stringToBytes32(loanIdStr);

      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(300000)
        .setFunction('getLoan', new ContractFunctionParameters().addBytes32(loanIdBytes32));

      const response = await query.execute(lender.client);
      
      const lenderAddr = response.getAddress(1);
      const borrowerAddr = response.getAddress(2);
      const principal = response.getUint256(3).toNumber();
      const installmentAmount = response.getUint256(4).toNumber();
      const installmentCount = response.getUint256(5).toNumber();
      const installmentsPaid = response.getUint256(6).toNumber();
      const statusInt = response.getUint8(7);
      const credentialHash = response.getString(10);

      const statusMap = ['PENDING', 'ACTIVE', 'REPAID', 'DEFAULTED'];

      return {
        loanId: loanIdStr,
        lender: lenderAddr,
        borrower: borrowerAddr,
        principal,
        installmentAmount,
        installmentCount,
        installmentsPaid,
        status: statusMap[statusInt] || 'UNKNOWN',
        credentialHash
      };
    } catch (e: any) {
      console.warn('[Contract] queryLoanOnChain note:', e.message);
      return null;
    }
  }
}
