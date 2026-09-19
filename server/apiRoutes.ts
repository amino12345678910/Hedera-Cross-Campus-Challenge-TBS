import type { IncomingMessage, ServerResponse } from 'http';
import { getServerStatus, performHederaHealthCheck } from './hederaClient';
import { ServerHcsService } from './hcsService';
import { ServerContractService } from './contractService';

// Helper to parse JSON body from incoming request
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

/**
 * Connect/Vite compatible middleware router for Hedera API endpoints.
 */
export async function handleHederaApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = req.url || '';

  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Only handle /api/hedera/*
  if (!url.startsWith('/api/hedera')) {
    return next();
  }

  try {
    // 1. GET /api/hedera/status
    if (url === '/api/hedera/status' && req.method === 'GET') {
      const status = await performHederaHealthCheck();
      return sendJson(res, 200, status);
    }

    // 2. POST /api/hedera/create-topic
    if (url === '/api/hedera/create-topic' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await ServerHcsService.createHcsTopic(body?.memo);
      return sendJson(res, 200, result);
    }

    // 3. POST /api/hedera/anchor (Event Anchor)
    if (url === '/api/hedera/anchor' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const topicId = body.topicId || process.env.HEDERA_TOPIC_ID;
      if (!topicId) {
        return sendJson(res, 400, { error: 'Topic ID is required to anchor event message' });
      }
      const receipt = await ServerHcsService.anchorEvidenceMessage(topicId, body.eventData);
      return sendJson(res, 200, receipt);
    }

    // 4. POST /api/hedera/anchor-credential (Portable Credential Anchor)
    if (url === '/api/hedera/anchor-credential' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const topicId = body.topicId || process.env.HEDERA_TOPIC_ID;
      if (!topicId) {
        return sendJson(res, 400, { error: 'Topic ID is required to anchor credential' });
      }
      const receipt = await ServerHcsService.anchorCredentialMessage(topicId, {
        credentialId: body.credentialId,
        credentialHash: body.credentialHash,
        holderDid: body.holderDid,
        issuedAt: body.issuedAt
      });
      return sendJson(res, 200, receipt);
    }

    // 5. POST /api/hedera/contract/create-loan (On-Chain Loan Creation & Funding)
    if (url === '/api/hedera/contract/create-loan' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const contractId = body.contractId || process.env.TRUSTLINE_CONTRACT_ID;
      if (!contractId) {
        return sendJson(res, 400, { error: 'TRUSTLINE_CONTRACT_ID not set or provided' });
      }
      const receipt = await ServerContractService.createAndFundLoanOnChain(contractId, {
        loanId: body.loanId,
        borrowerAccountId: body.borrowerAccountId,
        principalHbar: body.principalHbar || 5,
        installmentCount: body.installmentCount || 3,
        durationSeconds: body.durationSeconds || (90 * 24 * 3600),
        credentialHash: body.credentialHash
      });
      return sendJson(res, 200, receipt);
    }

    // 6. POST /api/hedera/contract/repay (On-Chain Installment Repayment)
    if (url === '/api/hedera/contract/repay' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const contractId = body.contractId || process.env.TRUSTLINE_CONTRACT_ID;
      if (!contractId) {
        return sendJson(res, 400, { error: 'TRUSTLINE_CONTRACT_ID not set or provided' });
      }
      const receipt = await ServerContractService.repayInstallmentOnChain(
        contractId,
        body.loanId,
        body.installmentAmountHbar || 1.67
      );
      return sendJson(res, 200, receipt);
    }

    // 7. GET /api/hedera/contract/loan/:loanId (Query On-Chain Loan)
    const loanMatch = url.match(/^\/api\/hedera\/contract\/loan\/([^/]+)$/);
    if (loanMatch && req.method === 'GET') {
      const loanId = loanMatch[1];
      const contractId = process.env.TRUSTLINE_CONTRACT_ID;
      if (!contractId) {
        return sendJson(res, 400, { error: 'TRUSTLINE_CONTRACT_ID not configured' });
      }
      const result = await ServerContractService.queryLoanOnChain(contractId, loanId);
      return sendJson(res, 200, result || { found: false });
    }

    // 8. GET /api/hedera/verify/:topicId/:seq
    const verifyMatch = url.match(/^\/api\/hedera\/verify\/([^/]+)\/(\d+)$/);
    if (verifyMatch && req.method === 'GET') {
      const topicId = verifyMatch[1];
      const sequenceNumber = parseInt(verifyMatch[2], 10);
      const rawData = await ServerHcsService.queryMirrorNodeMessage(topicId, sequenceNumber);
      
      let decodedMessage: any = null;
      if (rawData.message) {
        try {
          const rawUtf8 = Buffer.from(rawData.message, 'base64').toString('utf-8');
          decodedMessage = JSON.parse(rawUtf8);
        } catch {
          decodedMessage = Buffer.from(rawData.message, 'base64').toString('utf-8');
        }
      }

      return sendJson(res, 200, {
        verified: true,
        topicId,
        sequenceNumber,
        consensusTimestamp: rawData.consensus_timestamp,
        runningHash: rawData.running_hash,
        runningHashVersion: rawData.running_hash_version,
        payerAccountId: rawData.payer_account_id,
        decodedMessage,
        explorerUrl: `https://hashscan.io/testnet/topic/${topicId}`
      });
    }

    // 9. GET /api/hedera/messages/:topicId
    const messagesMatch = url.match(/^\/api\/hedera\/messages\/([^/]+)$/);
    if (messagesMatch && req.method === 'GET') {
      const topicId = messagesMatch[1];
      const result = await ServerHcsService.queryRecentTopicMessages(topicId);
      return sendJson(res, 200, result);
    }

    // Unknown route
    return sendJson(res, 404, { error: `Endpoint ${url} not found` });

  } catch (error: any) {
    console.error(`[Hedera API Error] ${url}:`, error?.message || error);
    return sendJson(res, 500, { 
      error: error?.message || 'Hedera server operation failed',
      isLive: false
    });
  }
}
