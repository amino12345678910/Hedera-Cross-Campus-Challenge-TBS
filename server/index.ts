import http from 'http';
import { handleHederaApiRequest } from './apiRoutes';
import { getServerStatus } from './hederaClient';

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  handleHederaApiRequest(req, res, () => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  });
});

server.listen(PORT, () => {
  const status = getServerStatus();
  console.log(`[TrustLine Hedera Server] Running on http://localhost:${PORT}`);
  console.log(`[TrustLine Hedera Server] Mode: ${status.isLive ? 'LIVE TESTNET' : 'DEMO FALLBACK'}`);
  if (status.isLive) {
    console.log(`[TrustLine Hedera Server] Operator: ${status.operatorIdMasked}, Topic: ${status.topicId || 'Auto-Provision on demand'}`);
  } else {
    console.log(`[TrustLine Hedera Server] Info: ${status.reason}`);
  }
});
