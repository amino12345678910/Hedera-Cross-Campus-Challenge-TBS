import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleHederaApiRequest } from './server/apiRoutes';

function hederaApiPlugin(): Plugin {
  return {
    name: 'hedera-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleHederaApiRequest(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handleHederaApiRequest(req, res, next);
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), hederaApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
