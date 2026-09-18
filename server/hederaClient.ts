import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

export interface ServerHederaStatus {
  isLive: boolean;
  isTwoPartyMode: boolean;
  isDemoAccountMode: boolean;
  lenderIdMasked?: string;
  borrowerIdMasked?: string;
  operatorIdMasked?: string;
  topicId?: string;
  contractId?: string;
  hcsLive: boolean;
  contractLive: boolean;
  network: 'testnet';
  reason?: string;
}

let cachedLenderClient: Client | null = null;
let cachedBorrowerClient: Client | null = null;
let clientError: string | null = null;

/**
 * Safely parses Hedera private key, explicitly prioritizing ECDSA keys generated from Hedera Portal.
 * Never prints or logs the private key.
 */
export function parseHederaPrivateKey(rawKey: string): PrivateKey {
  if (!rawKey) {
    throw new Error('Private key is empty or undefined');
  }

  // Trim whitespace and remove any accidental surrounding quotes
  let clean = rawKey.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }

  // 1. Explicitly try ECDSA first for Portal secp256k1 accounts
  try {
    return PrivateKey.fromStringECDSA(clean);
  } catch (errECDSA) {
    // 2. Try DER format if it starts with DER prefixes or is longer
    if (clean.startsWith('302e') || clean.startsWith('3030') || clean.length > 64) {
      try {
        return PrivateKey.fromStringDer(clean);
      } catch (errDer) {
        // Fall through
      }
    }

    // 3. Try ED25519 fallback
    try {
      return PrivateKey.fromStringED25519(clean);
    } catch (errED) {
      throw new Error(`Failed to parse Hedera private key (ECDSA, DER, or ED25519 expected). Error: ${errECDSA instanceof Error ? errECDSA.message : String(errECDSA)}`);
    }
  }
}

function maskAccountId(accId?: string): string | undefined {
  if (!accId || !accId.includes('.')) return undefined;
  const parts = accId.split('.');
  return `${parts[0]}.${parts[1]}.***${parts[2].slice(-3)}`;
}

/**
 * Returns the Lender Hedera Client.
 * Falls back to HEDERA_OPERATOR if HEDERA_LENDER is not defined.
 */
export function getLenderClient(): { client: Client | null; isLive: boolean; accountId?: string; error?: string } {
  if (cachedLenderClient) {
    const acc = process.env.HEDERA_LENDER_ID?.trim() || process.env.HEDERA_OPERATOR_ID?.trim();
    return { client: cachedLenderClient, isLive: true, accountId: acc };
  }

  const lenderIdStr = process.env.HEDERA_LENDER_ID?.trim() || process.env.HEDERA_OPERATOR_ID?.trim();
  const lenderKeyStr = process.env.HEDERA_LENDER_KEY?.trim() || process.env.HEDERA_OPERATOR_KEY?.trim();

  if (!lenderIdStr || !lenderKeyStr) {
    clientError = 'Hedera operator/lender credentials not configured';
    return { client: null, isLive: false, error: clientError };
  }

  try {
    const operatorId = AccountId.fromString(lenderIdStr);
    const operatorKey = parseHederaPrivateKey(lenderKeyStr);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    cachedLenderClient = client;
    return { client: cachedLenderClient, isLive: true, accountId: lenderIdStr };
  } catch (err: any) {
    clientError = `Failed to initialize Lender Client: ${err?.message || err}`;
    console.warn('[Hedera Server] Warning:', clientError);
    return { client: null, isLive: false, error: clientError };
  }
}

/**
 * Returns the Borrower Hedera Client.
 * If HEDERA_BORROWER_ID is configured, returns a dedicated client for Ahmed's repayments.
 * Otherwise falls back to lender/operator client in DEMO ACCOUNT MODE.
 */
export function getBorrowerClient(): { client: Client | null; isLive: boolean; isSeparate: boolean; accountId?: string } {
  const borrowerIdStr = process.env.HEDERA_BORROWER_ID?.trim();
  const borrowerKeyStr = process.env.HEDERA_BORROWER_KEY?.trim();

  if (borrowerIdStr && borrowerKeyStr) {
    if (cachedBorrowerClient) {
      return { client: cachedBorrowerClient, isLive: true, isSeparate: true, accountId: borrowerIdStr };
    }
    try {
      const borrowerId = AccountId.fromString(borrowerIdStr);
      const borrowerKey = parseHederaPrivateKey(borrowerKeyStr);
      const client = Client.forTestnet().setOperator(borrowerId, borrowerKey);
      cachedBorrowerClient = client;
      return { client: cachedBorrowerClient, isLive: true, isSeparate: true, accountId: borrowerIdStr };
    } catch (e: any) {
      console.warn('[Hedera Server] Borrower client init note:', e?.message || e);
    }
  }

  // Fallback to lender/operator
  const lender = getLenderClient();
  return { client: lender.client, isLive: lender.isLive, isSeparate: false, accountId: lender.accountId };
}

export function getHederaClient(): { client: Client | null; isLive: boolean; error?: string } {
  return getLenderClient();
}

export function getServerStatus(): ServerHederaStatus {
  const lender = getLenderClient();
  const borrower = getBorrowerClient();

  const lenderId = process.env.HEDERA_LENDER_ID?.trim() || process.env.HEDERA_OPERATOR_ID?.trim();
  const borrowerId = process.env.HEDERA_BORROWER_ID?.trim();
  const topicId = process.env.HEDERA_TOPIC_ID?.trim() || undefined;
  const contractId = process.env.TRUSTLINE_CONTRACT_ID?.trim() || undefined;

  const isTwoPartyMode = Boolean(lender.isLive && borrower.isSeparate && borrowerId);

  return {
    isLive: lender.isLive,
    isTwoPartyMode,
    isDemoAccountMode: !isTwoPartyMode,
    lenderIdMasked: maskAccountId(lenderId),
    borrowerIdMasked: maskAccountId(borrowerId || lenderId),
    operatorIdMasked: maskAccountId(lenderId),
    topicId,
    contractId,
    hcsLive: Boolean(lender.isLive && topicId),
    contractLive: Boolean(lender.isLive && contractId),
    network: 'testnet',
    reason: lender.isLive ? undefined : (lender.error || 'Credentials not configured')
  };
}
