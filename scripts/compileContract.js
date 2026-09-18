import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractPath = path.resolve(__dirname, '../contracts/TrustLineVault.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'TrustLineVault.sol': {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

console.log('Compiling TrustLineVault.sol...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasError = false;
  for (const error of output.errors) {
    console.log(error.formattedMessage);
    if (error.severity === 'error') hasError = true;
  }
  if (hasError) {
    process.exit(1);
  }
}

const contract = output.contracts['TrustLineVault.sol']['TrustLineVault'];
const artifact = {
  contractName: 'TrustLineVault',
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object,
  compiledAt: new Date().toISOString()
};

const artifactPath = path.resolve(__dirname, '../contracts/TrustLineVault.json');
fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

console.log(`✓ TrustLineVault compiled successfully! Artifact written to contracts/TrustLineVault.json`);
