import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config';

// Auth service proxy configuration
export const authServiceProxy = createProxyMiddleware({
    target: config.authServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '', // Remove /api/auth prefix when forwarding to auth service
    },
    on: {
        error: (err: Error, _req: any, res: any) => {
            console.error('Proxy error:', err);
            if (res && !res.headersSent) {
                res.status(503).json({
                    error: 'Service temporarily unavailable',
                    message: 'Auth service is currently unreachable'
                });
            }
        },
        proxyReq: (_proxyReq: any, req: any) => {
            // Add any custom headers or modifications here
            console.log(`Proxying ${req.method} ${req.url} to ${config.authServiceUrl}`);
        },
        proxyRes: (proxyRes: any, req: any) => {
            console.log(`Response from auth service: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
        }
    }
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
