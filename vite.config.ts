import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handlePaymentApi } from './server/payments.js';

function paymentApiPlugin(): Plugin {
  return {
    name: 'payment-api-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/payments') || url.startsWith('/api/admin')) {
          handlePaymentApi(req, res);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/payments') || url.startsWith('/api/admin')) {
          handlePaymentApi(req, res);
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
        strictPort: true,
        allowedHosts: true,
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
        strictPort: true,
        allowedHosts: true,
      },
      plugins: [react(), paymentApiPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
