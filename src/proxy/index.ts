import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config';

// Auth service proxy configuration
export const authServiceProxy = createProxyMiddleware({
  target: config.authServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Remove /auth prefix when forwarding to auth service
  },
  timeout: 30000,
  proxyTimeout: 30000,
  secure: false,
  followRedirects: true,
  // Use default settings to avoid body handling issues
  // Let http-proxy-middleware handle the body automatically
});

// Future service proxy configurations can be added here
// Example:
// export const gameServiceProxy = createProxyMiddleware({
//   target: config.gameServiceUrl,
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api/game': '',
//   }
// });
