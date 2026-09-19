import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env explicitly
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  dotenv.config();
}

export interface ServerHederaStatus {
  isLive: boolean;
  mode: 'LIVE' | 'SIMULATED';
  statusLabel: 'LIVE • HEDERA TESTNET' | 'SIMULATED • DEMO FALLBACK';
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
  hasValidCredentials: boolean;
  clientInitialized: boolean;
  topicReachable?: boolean;
  contractConfigured: boolean;
}

let cachedLenderClient: Client | null = null;
let cachedBorrowerClient: Client | null = null;
let clientError: string | null = null;

/**
 * Safely parses Hedera private key, prioritizing ECDSA keys generated from Hedera Portal.
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
      throw new Error(`Failed to parse Hedera private key (ECDSA, DER, or ED25519 expected).`);
    }
  }
}

function maskAccountId(accId?: string): string | undefined {
  if (!accId || !accId.includes('.')) return undefined;
  const parts = accId.split('.');
  return `${parts[0]}.${parts[1]}.***${parts[2].slice(-3)}`;
}

/**
 * Helper to get clean environment variable with fallback aliases.
 */
function getEnvVar(...keys: string[]): string | undefined {
  for (const k of keys) {
    const val = process.env[k]?.trim();
    if (val && val.length > 0) return val;
  }
  return undefined;
}

/**
 * Returns the Lender Hedera Client.
 * Falls back to HEDERA_OPERATOR if HEDERA_LENDER is not defined.
 */
export function getLenderClient(): { client: Client | null; isLive: boolean; accountId?: string; error?: string } {
  const lenderIdStr = getEnvVar('HEDERA_LENDER_ID', 'HEDERA_OPERATOR_ID', 'VITE_HEDERA_LENDER_ID');
  const lenderKeyStr = getEnvVar('HEDERA_LENDER_KEY', 'HEDERA_LENDER_PRIVATE_KEY', 'HEDERA_OPERATOR_KEY', 'HEDERA_OPERATOR_PRIVATE_KEY');

  if (cachedLenderClient && lenderIdStr) {
    return { client: cachedLenderClient, isLive: true, accountId: lenderIdStr };
  }

  if (!lenderIdStr || !lenderKeyStr) {
    clientError = 'Hedera operator/lender credentials not configured';
    return { client: null, isLive: false, error: clientError };
  }

  try {
    const operatorId = AccountId.fromString(lenderIdStr);
    const operatorKey = parseHederaPrivateKey(lenderKeyStr);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    cachedLenderClient = client;
    clientError = null;
    return { client: cachedLenderClient, isLive: true, accountId: lenderIdStr };
  } catch (err: any) {
    clientError = `Failed to initialize Lender Client: ${err?.message || err}`;
    console.warn('[Hedera Server] Warning:', clientError);
    return { client: null, isLive: false, error: clientError };
  }
}

/**
 * Returns the Borrower Hedera Client.
 * If HEDERA_BORROWER_ID is configured, returns a dedicated client for repayments.
 * Otherwise falls back to lender client in DEMO ACCOUNT MODE.
 */
export function getBorrowerClient(): { client: Client | null; isLive: boolean; isSeparate: boolean; accountId?: string } {
  const borrowerIdStr = getEnvVar('HEDERA_BORROWER_ID', 'VITE_HEDERA_BORROWER_ID');
  const borrowerKeyStr = getEnvVar('HEDERA_BORROWER_KEY', 'HEDERA_BORROWER_PRIVATE_KEY');

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

/**
 * Runtime health check evaluating live Hedera credentials and connectivity.
 */
export async function performHederaHealthCheck(): Promise<ServerHederaStatus> {
  const lender = getLenderClient();
  const borrower = getBorrowerClient();

  const lenderId = getEnvVar('HEDERA_LENDER_ID', 'HEDERA_OPERATOR_ID', 'VITE_HEDERA_LENDER_ID');
  const borrowerId = getEnvVar('HEDERA_BORROWER_ID', 'VITE_HEDERA_BORROWER_ID');
  const topicId = getEnvVar('HEDERA_TOPIC_ID', 'HCS_TOPIC_ID', 'VITE_HEDERA_TOPIC_ID');
  const contractId = getEnvVar('TRUSTLINE_CONTRACT_ID', 'HEDERA_CONTRACT_ID', 'VITE_TRUSTLINE_CONTRACT_ID');

  const hasValidCredentials = Boolean(lender.isLive && lender.client);
  const clientInitialized = hasValidCredentials;
  const isTwoPartyMode = Boolean(lender.isLive && borrower.isSeparate && borrowerId);

  let topicReachable = false;
  if (topicId) {
    try {
      const resp = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=1`, {
        signal: AbortSignal.timeout(3000)
      });
      topicReachable = resp.ok;
    } catch {
      topicReachable = hasValidCredentials;
    }
  }

  const isLive = Boolean(hasValidCredentials && clientInitialized);

  return {
    isLive,
    mode: isLive ? 'LIVE' : 'SIMULATED',
    statusLabel: isLive ? 'LIVE • HEDERA TESTNET' : 'SIMULATED • DEMO FALLBACK',
    isTwoPartyMode,
    isDemoAccountMode: !isTwoPartyMode,
    lenderIdMasked: maskAccountId(lenderId),
    borrowerIdMasked: maskAccountId(borrowerId || lenderId),
    operatorIdMasked: maskAccountId(lenderId),
    topicId,
    contractId,
    hcsLive: Boolean(isLive && topicId),
    contractLive: Boolean(isLive && contractId),
    network: 'testnet',
    reason: isLive ? undefined : (lender.error || 'Hedera Testnet credentials not configured'),
    hasValidCredentials,
    clientInitialized,
    topicReachable,
    contractConfigured: Boolean(contractId)
  };
}

export function getServerStatus(): ServerHederaStatus {
  const lender = getLenderClient();
  const borrower = getBorrowerClient();

  const lenderId = getEnvVar('HEDERA_LENDER_ID', 'HEDERA_OPERATOR_ID', 'VITE_HEDERA_LENDER_ID');
  const borrowerId = getEnvVar('HEDERA_BORROWER_ID', 'VITE_HEDERA_BORROWER_ID');
  const topicId = getEnvVar('HEDERA_TOPIC_ID', 'HCS_TOPIC_ID', 'VITE_HEDERA_TOPIC_ID');
  const contractId = getEnvVar('TRUSTLINE_CONTRACT_ID', 'HEDERA_CONTRACT_ID', 'VITE_TRUSTLINE_CONTRACT_ID');

  const hasValidCredentials = Boolean(lender.isLive && lender.client);
  const isTwoPartyMode = Boolean(lender.isLive && borrower.isSeparate && borrowerId);
  const isLive = hasValidCredentials;

  return {
    isLive,
    mode: isLive ? 'LIVE' : 'SIMULATED',
    statusLabel: isLive ? 'LIVE • HEDERA TESTNET' : 'SIMULATED • DEMO FALLBACK',
    isTwoPartyMode,
    isDemoAccountMode: !isTwoPartyMode,
    lenderIdMasked: maskAccountId(lenderId),
    borrowerIdMasked: maskAccountId(borrowerId || lenderId),
    operatorIdMasked: maskAccountId(lenderId),
    topicId,
    contractId,
    hcsLive: Boolean(isLive && topicId),
    contractLive: Boolean(isLive && contractId),
    network: 'testnet',
    reason: isLive ? undefined : (lender.error || 'Hedera Testnet credentials not configured'),
    hasValidCredentials,
    clientInitialized: hasValidCredentials,
    topicReachable: true,
    contractConfigured: Boolean(contractId)
  };
}
