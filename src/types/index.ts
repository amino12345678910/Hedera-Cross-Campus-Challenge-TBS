export type EventCategory = 
  | 'EDUCATION' 
  | 'INCOME' 
  | 'UTILITY' 
  | 'MICRO_LOAN' 
  | 'HOUSING' 
  | 'MEMBERSHIP';

export type EventStatus = 
  | 'COMPLETED' 
  | 'VERIFIED' 
  | 'PAID_ON_TIME' 
  | 'PAID_LATE' 
  | 'DEFAULTED';

export type VerificationStatus = 
  | 'ANCHORED_HCS' 
  | 'VERIFIED_ON_LEDGER';

export interface HederaProof {
  topicId: string;                // e.g. '0.0.10581166'
  sequenceNumber: number;         // e.g. 14208
  consensusTimestamp: string;     // e.g. '1718920145.289190123'
  formattedTimestamp: string;     // ISO or human format
  transactionId: string;          // e.g. '0.0.482910@1718920145.289190123'
  runningHash: string;            // SHA-384 truncated or SHA-256
  messageHash: string;            // SHA-256 of the event payload
  submitterAccountId: string;     // e.g. '0.0.482910' (TrustLine Oracles Node)
  explorerUrl: string;            // Real or Simulated HashScan URL
  isLiveVerified?: boolean;       // True if fetched from live Hedera Mirror Node
}

export interface HederaNetworkStatus {
  isLive: boolean;
  isTwoPartyMode?: boolean;
  isDemoAccountMode?: boolean;
  lenderIdMasked?: string;
  borrowerIdMasked?: string;
  operatorIdMasked?: string;
  topicId?: string;
  contractId?: string;
  hcsLive?: boolean;
  contractLive?: boolean;
  network: 'testnet';
  reason?: string;
}

export interface FinancialEvent {
  id: string;
  title: string;
  category: EventCategory;
  amount: number;
  currency: 'TND';
  date: string;
  dueDate?: string;
  isObligation: boolean;
  status: EventStatus;
  daysLate?: number;
  counterparty: string;
  description: string;
  proof: HederaProof;
}

export interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  occupation: string;
  avatarUrl: string;
  location: string;
  nationalIdMasked: string;
  hederaAccountId: string;
  portableDid: string;
  conventionalCreditHistory: 'Limited' | 'None' | 'Established';
  verifiedFinancialEvents: number;
  repaymentObligations: number;
  completedObligations: number;
  onTimeObligations: number;
  lateObligations: number;
  defaults: number;
  verifiedIncomeSources: number;
  incomesList: {
    source: string;
    type: string;
    monthlyAvg: number;
    verifiedSince: string;
  }[];
}

export interface ReliabilityMetrics {
  reliabilityScore: number;         // Transparent index (e.g. 88 / 100)
  scoreLabel: string;               // "High Observable Reliability"
  fulfillmentRate: number;          // % (11/12 = 91.7%)
  onTimeRate: number;               // % (10/11 = 90.9%)
  defaultRate: number;              // 0%
  totalInflowVerified: number;      // TND
  totalObligationsRepaid: number;   // TND
  activeLoanCount: number;
  cashflowBufferRatio: number;      // monthly net / requested burden
  auditDisclaimer: string;
}

export interface AIEvidenceExplanation {
  verdict: 'APPROVED_BY_POLICY' | 'REQUIRES_CO_SIGNER' | 'OUTSIDE_POLICY';
  confidenceScore: number;
  headline: string;
  summary: string;
  concreteEvidenceCitations: {
    title: string;
    details: string;
    type: 'positive' | 'warning' | 'neutral';
    linkedEventId?: string;
  }[];
  policyBoundsCheck: {
    rule: string;
    threshold: string;
    actual: string;
    passed: boolean;
  }[];
  concludingRemarks: string;
}

export interface LoanRepaymentRecord {
  installmentNumber: number;
  amountTND: number;
  amountHbar: number;
  txHash: string;
  date: string;
  isLive: boolean;
  explorerUrl: string;
}

export interface LoanApplication {
  id: string;
  borrowerId: string;
  borrowerName: string;
  amount: number;                     // 1,000 TND (requested business amount)
  currency: 'TND';
  purpose: string;
  termDays: number;
  interestRateAnnual: number;
  monthlyRepayment: number;
  collateral: 'None';
  status: 'DRAFT' | 'SUBMITTED' | 'ANALYZED' | 'LENDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  submittedAt?: string;
  approvedAt?: string;
  smartContractAddress?: string;
  contractTxHash?: string;
  
  // Real Testnet Lending Lifecycle Fields
  principalHbar: number;              // e.g. 5 HBAR (demonstration funds)
  installmentCount: number;           // 3 installments
  installmentsPaid: number;          // 0 to 3
  installmentAmountHbar: number;      // 1.67 HBAR
  loanIdOnChain?: string;            // e.g. 'TL-2026-0001'
  contractId?: string;               // e.g. '0.0.xxxxx'
  isDemoAccountMode?: boolean;
  onChainStatus?: 'PENDING' | 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  repayments: LoanRepaymentRecord[];
}

/**
 * TrustLine Portable Credential Models (W3C Verifiable Credential Spirit)
 */
export interface CredentialClaims {
  verifiedEvents: number;
  repaymentObligations: number;
  completedObligations: number;
  onTimeObligations: number;
  lateObligations: number;
  defaults: number;
  verifiedIncomeSources: number;
  totalObligationsRepaidTND: number;
  verifiedInflowsTND: number;
  reliabilityIndicator: number;
  reliabilityIndicatorLabel: string;
}

export interface TrustLineCredential {
  id: string;                                // e.g. 'cred_tl_2026_ahmed_ba'
  version: string;                           // e.g. '1.0', '2.0', '3.0'
  previousCredentialHash?: string;           // Provenance link to previous version
  type: 'TrustLineFinancialReliabilityCredential';
  issuer: string;                            // 'did:hedera:testnet:0.0.482910_trustline_issuer'
  issuerName: string;                        // 'TrustLine Protocol'
  holder: string;                            // 'Ahmed Ben Ali'
  holderDid: string;                         // 'did:hedera:testnet:0.0.781944_trustline_cred'
  issuedAt: string;                          // ISO 8601
  expiresAt: string;                         // ISO 8601 (1 year validity)
  status: 'ACTIVE' | 'REVOKED';
  claims: CredentialClaims;
  evidenceSummary: string;
  credentialHash: string;                    // SHA-256 hash (0x...) of canonical claims
  canonicalPayloadString: string;            // Normalized JSON string hashed
  hederaAnchor: {
    topicId: string;
    sequenceNumber: number;
    consensusTimestamp: string;
    transactionId: string;
    isLive: boolean;
    explorerUrl: string;
  };
}

export interface CredentialVerificationResult {
  isValid: boolean;
  structureValid: boolean;
  hashMatches: boolean;
  computedHash: string;
  anchoredHash: string;
  hederaAnchorFound: boolean;
  consensusTimestampVerified: boolean;
  unmodified: boolean;
  hcsTimestamp: string;
  topicId: string;
  sequenceNumber: number;
  details: string[];
  tamperedFields?: string[];
}
