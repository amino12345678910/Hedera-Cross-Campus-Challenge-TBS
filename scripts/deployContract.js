import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  Client, 
  AccountId, 
  PrivateKey, 
  ContractCreateFlow,
  AccountInfoQuery 
} from '@hashgraph/sdk';

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
      throw new Error(`Failed to parse Hedera private key (ECDSA, DER, or ED25519 expected). Error: ${errECDSA?.message || errECDSA}`);
    }
  }
}

async function verifyAccountMatch(accountIdStr, parsedKey, network = 'testnet') {
  const accountId = AccountId.fromString(accountIdStr.trim());
  const derivedPublicKey = parsedKey.publicKey;
  const derivedType = derivedPublicKey.type;
  const isECDSA = (derivedType === 'secp256k1' || derivedType === 'ecdsa');
  const pubRaw = derivedPublicKey.toStringRaw();
  const pubDer = derivedPublicKey.toStringDer();
  const fingerprint = `${pubRaw.substring(0, 8)}...${pubRaw.substring(pubRaw.length - 8)}`;

  console.log(`\n📋 Deployer Credential Diagnostic:`);
  console.log(`   Account ID:  ${accountId.toString()}`);
  console.log(`   Key Type:    ${isECDSA ? 'ECDSA (secp256k1)' : 'ED25519'}`);
  console.log(`   Public Key:  ${fingerprint}`);
  console.log(`   Network:     ${network}`);

  // Query Mirror Node
  const mirrorUrl = `https://${network}.mirrornode.hedera.com/api/v1/accounts/${accountId.toString()}`;
  try {
    const res = await fetch(mirrorUrl);
    if (res.ok) {
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
          console.error(`   On-chain public key: ${onChainRaw ? onChainRaw.substring(0, 8) + '...' + onChainRaw.substring(onChainRaw.length - 8) : 'unknown'}`);
          console.error(`   Derived key:        ${fingerprint}`);
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
      console.error(`\n❌ PRIVATE KEY DOES NOT MATCH ACCOUNT (INVALID_SIGNATURE)\n`);
      return { match: false, reason: 'PRIVATE KEY DOES NOT MATCH ACCOUNT' };
    }
    return { match: true, isECDSA };
  }
}

async function deploy() {
  const operatorIdStr = process.env.HEDERA_OPERATOR_ID || process.env.HEDERA_LENDER_ID;
  const operatorKeyStr = process.env.HEDERA_OPERATOR_KEY || process.env.HEDERA_LENDER_KEY;

  if (!operatorIdStr || !operatorKeyStr) {
    console.error('\n❌ ERROR: HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be set in .env before deploying.');
    process.exit(1);
  }

  const artifactPath = path.resolve(__dirname, '../contracts/TrustLineVault.json');
  if (!fs.existsSync(artifactPath)) {
    console.error('\n❌ ERROR: contracts/TrustLineVault.json not found. Run npm run compile-contract first.');
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  console.log('\n==================================================');
  console.log('Deploying TrustLineVault to Hedera Testnet');
  console.log('==================================================');

  const operatorKey = parseHederaPrivateKey(operatorKeyStr);
  const operatorId = AccountId.fromString(operatorIdStr.trim());

  const diagnostic = await verifyAccountMatch(operatorIdStr, operatorKey, 'testnet');
  if (!diagnostic.match) {
    console.error(`❌ Diagnostic check failed: ${diagnostic.reason}`);
    console.error('Aborting contract deployment to prevent unnecessary failed transactions.\n');
    process.exit(1);
  }

  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  console.log(`Operator Account: ${operatorId.toString()}`);
  console.log(`Bytecode length:  ${artifact.bytecode.length} characters`);
  console.log('Submitting ContractCreateFlow transaction to Hedera Testnet...');

  const contractCreateFlow = new ContractCreateFlow()
    .setGas(3000000)
    .setBytecode(artifact.bytecode)
    .setContractMemo('TrustLine Undercollateralized Lending Vault v1.0');

  const txResponse = await contractCreateFlow.execute(client);
  const receipt = await txResponse.getReceipt(client);

  const contractId = receipt.contractId ? receipt.contractId.toString() : null;

  if (!contractId) {
    throw new Error('Failed to retrieve contract ID from receipt');
  }

  console.log('\n==================================================');
  console.log('TrustLineVault deployed');
  console.log('Network: Hedera Testnet');
  console.log(`Contract ID: ${contractId}`);
  console.log(`HashScan URL: https://hashscan.io/testnet/contract/${contractId}`);
  console.log('==================================================\n');

  // Update or append TRUSTLINE_CONTRACT_ID in .env
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

  if (envContent.includes('TRUSTLINE_CONTRACT_ID=')) {
    envContent = envContent.replace(/TRUSTLINE_CONTRACT_ID=.*/g, `TRUSTLINE_CONTRACT_ID=${contractId}`);
  } else {
    envContent += `\nTRUSTLINE_CONTRACT_ID=${contractId}\n`;
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log(`✓ Saved TRUSTLINE_CONTRACT_ID=${contractId} into .env`);

  artifact.networks = {
    testnet: {
      contractId: contractId,
      deployedAt: new Date().toISOString()
    }
  };
  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

  client.close();
}

deploy().catch(err => {
  console.error('\n❌ Deployment failed:', err.message || err);
  process.exit(1);
});
