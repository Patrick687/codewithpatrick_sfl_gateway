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

// League service proxy configuration
export const leagueServiceProxy = createProxyMiddleware({
  target: config.leagueServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/$': '/leagues', // Rewrite exact root path to /leagues
    '^/(.*)$': '/leagues/$1', // Rewrite sub-paths to /leagues/sub-path
  },
  timeout: 30000,
  proxyTimeout: 30000,
  secure: false,
  followRedirects: true,
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
