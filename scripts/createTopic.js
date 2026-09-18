import { 
  Client, 
  AccountId, 
  PrivateKey, 
  TopicCreateTransaction, 
  AccountInfoQuery 
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

/**
 * Safely parses Hedera private key, explicitly prioritizing ECDSA keys generated from Hedera Portal.
 * Never prints or logs the private key.
 */
function parseHederaPrivateKey(rawKey) {
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

    // 3. Try ED25519 fallback if key is ED25519
    try {
      return PrivateKey.fromStringED25519(clean);
    } catch (errED) {
      throw new Error(`Failed to parse Hedera private key (ECDSA, DER, or ED25519 expected). Parser error: ${errECDSA?.message || errECDSA}`);
    }
  }
}

/**
 * Safely verifies that the private key corresponds to the configured account.
 */
async function verifyAccountMatch(accountIdStr, parsedKey, network = 'testnet') {
  const accountId = AccountId.fromString(accountIdStr.trim());
  const derivedPublicKey = parsedKey.publicKey;
  const derivedType = derivedPublicKey.type;
  const isECDSA = (derivedType === 'secp256k1' || derivedType === 'ecdsa');

  const pubRaw = derivedPublicKey.toStringRaw();
  const pubDer = derivedPublicKey.toStringDer();
  const fingerprint = `${pubRaw.substring(0, 8)}...${pubRaw.substring(pubRaw.length - 8)}`;

  console.log(`\n📋 Credential Diagnostic:`);
  console.log(`   Account ID:  ${accountId.toString()}`);
  console.log(`   Key Type:    ${isECDSA ? 'ECDSA (secp256k1)' : 'ED25519'}`);
  console.log(`   Public Key:  ${fingerprint}`);
  console.log(`   Network:     ${network}`);

  // Query Mirror Node to check on-chain account public key
  const mirrorUrl = `https://${network}.mirrornode.hedera.com/api/v1/accounts/${accountId.toString()}`;
  try {
    const res = await fetch(mirrorUrl);
    if (!res.ok) {
      if (res.status === 404) {
        console.error(`\n❌ ACCOUNT NOT FOUND ON ${network.toUpperCase()}: ${accountId.toString()}`);
        return { match: false, reason: `Account ${accountId.toString()} does not exist on Hedera ${network}` };
      }
      console.warn(`⚠️ Mirror Node returned HTTP ${res.status}, falling back to SDK signature check...`);
    } else {
      const data = await res.json();
      const onChainKey = data.key;
      if (onChainKey) {
        const onChainRaw = onChainKey.key ? onChainKey.key.toLowerCase() : '';
        const derivedRawLower = pubRaw.toLowerCase();
        const derivedDerLower = pubDer.toLowerCase();

        const matches = (
          onChainRaw === derivedRawLower ||
          onChainRaw === derivedDerLower ||
          (onChainKey._type && onChainKey._type.includes('ECDSA') && isECDSA && (onChainRaw.includes(derivedRawLower) || derivedDerLower.includes(onChainRaw)))
        );

        if (matches) {
          console.log(`✅ ACCOUNT / KEY MATCH VERIFIED on Hedera Mirror Node!\n`);
          return { match: true, isECDSA };
        } else {
          console.error(`\n❌ PRIVATE KEY DOES NOT MATCH ACCOUNT!`);
          console.error(`   On-chain public key (${onChainKey._type || 'type unknown'}): ${onChainRaw ? onChainRaw.substring(0, 8) + '...' + onChainRaw.substring(onChainRaw.length - 8) : 'unknown'}`);
          console.error(`   Derived public key from key string:           ${fingerprint}`);
          console.error(`   Please ensure HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY belong to the exact same account.\n`);
          return { match: false, reason: 'PRIVATE KEY DOES NOT MATCH ACCOUNT' };
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Mirror Node connectivity note:', err?.message || err);
  }

  // Fallback: Verify via live Hedera query
  try {
    const client = Client.forTestnet().setOperator(accountId, parsedKey);
    await new AccountInfoQuery().setAccountId(accountId).execute(client);
    console.log(`✅ ACCOUNT / KEY MATCH VERIFIED (via Hedera Node Signature)\n`);
    client.close();
    return { match: true, isECDSA };
  } catch (sdkErr) {
    if (sdkErr?.message && sdkErr.message.includes('INVALID_SIGNATURE')) {
      console.error(`\n❌ PRIVATE KEY DOES NOT MATCH ACCOUNT (Hedera node returned INVALID_SIGNATURE)\n`);
      return { match: false, reason: 'PRIVATE KEY DOES NOT MATCH ACCOUNT' };
    }
    return { match: true, isECDSA };
  }
}

async function main() {
  const operatorIdStr = process.env.HEDERA_OPERATOR_ID || process.env.HEDERA_LENDER_ID;
  const operatorKeyStr = process.env.HEDERA_OPERATOR_KEY || process.env.HEDERA_LENDER_KEY;

  if (!operatorIdStr || !operatorKeyStr) {
    console.error('\n❌ ERROR: HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be set in .env before creating a topic.');
    console.error('👉 Get free testnet credentials at: https://portal.hedera.com\n');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('🔍 TrustLine HCS Topic Creator & Credential Diagnostic');
  console.log('======================================================');

  // 1. Explicit ECDSA parsing (with trim & whitespace protection)
  const operatorKey = parseHederaPrivateKey(operatorKeyStr);
  const operatorId = AccountId.fromString(operatorIdStr.trim());

  // 2. Safe account & key match diagnostic
  const diagnostic = await verifyAccountMatch(operatorIdStr, operatorKey, 'testnet');
  if (!diagnostic.match) {
    console.error(`❌ Diagnostic check failed: ${diagnostic.reason}`);
    console.error('Aborting topic creation to prevent unnecessary failed transactions.\n');
    process.exit(1);
  }

  console.log('🔗 Connecting client to Hedera Testnet...');
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  console.log(`📡 Creating new Hedera Consensus Service (HCS) Topic...`);
  const tx = new TopicCreateTransaction()
    .setTopicMemo('TrustLine Portable Financial Reliability Audit Stream');

  const response = await tx.execute(client);
  const receipt = await response.getReceipt(client);
  const newTopicId = receipt.topicId?.toString();

  if (!newTopicId) {
    console.error('❌ Failed to get TopicId from receipt.');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('✅ HCS TOPIC SUCCESSFULLY CREATED ON HEDERA TESTNET!');
  console.log('======================================================');
  console.log(`📌 Topic ID:       ${newTopicId}`);
  console.log(`🌐 HashScan URL:   https://hashscan.io/testnet/topic/${newTopicId}`);
  console.log(`⏱ Transaction ID: ${response.transactionId.toString()}`);
  console.log('======================================================\n');

  // Update .env with new topic ID
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('HEDERA_TOPIC_ID=')) {
      envContent = envContent.replace(/HEDERA_TOPIC_ID=.*/g, `HEDERA_TOPIC_ID=${newTopicId}`);
    } else {
      envContent += `\nHEDERA_TOPIC_ID=${newTopicId}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`💾 Saved HEDERA_TOPIC_ID=${newTopicId} into .env\n`);
  } else {
    console.log(`👉 Add this to your .env file: HEDERA_TOPIC_ID=${newTopicId}\n`);
  }

  client.close();
}

main().catch((err) => {
  console.error('\n❌ Unexpected error creating HCS topic:', err?.message || err);
  process.exit(1);
});
