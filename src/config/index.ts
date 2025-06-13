import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // Service URLs
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',

    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',

    // CORS Configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
} as const;

export default config;
