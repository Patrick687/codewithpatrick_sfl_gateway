import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authServiceProxy, leagueServiceProxy } from './proxy';
import { verifyToken } from './middleware/auth';
import { setupSwagger } from './config/swagger';
import { createHealthResponse } from './types/api';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        // Parse multiple origins from config
        const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use(morgan('combined'));

// Proxy routes (BEFORE body parsing) - This ensures the proxy gets the raw body
app.use('/auth', authServiceProxy);
app.use('/leagues', verifyToken, leagueServiceProxy);

// Body parsing middleware (for non-proxy routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup Swagger documentation
setupSwagger(app);

// Health endpoint
app.get('/health', (_req, res) => {
  const healthResponse = createHealthResponse('sfl-gateway', '1.0.0');
  res.status(200).json(healthResponse);
});

/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: Auth service health check (proxied)
 *     description: Proxies health check request to the auth service
 *     tags: [Auth Service (Proxied)]
 *     responses:
 *       200:
 *         description: Auth service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (proxied to auth service)
 *     description: Creates a new user account. This request is proxied to the auth service.
 *     tags: [Auth Service (Proxied)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user (proxied to auth service)
 *     description: Authenticates a user and returns a JWT token. This request is proxied to the auth service.
 *     tags: [Auth Service (Proxied)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login (proxied to auth service)
 *     description: Redirects to Google OAuth consent screen
 *     tags: [Auth Service (Proxied)]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback (proxied to auth service)
 *     description: Handles the callback from Google OAuth and returns a JWT token
 *     tags: [Auth Service (Proxied)]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: OAuth authorization code from Google
 *     responses:
 *       200:
 *         description: OAuth login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: OAuth login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password (proxied to auth service)
 *     description: Changes the password for an authenticated user
 *     tags: [Auth Service (Proxied)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Protected route example (proxied to auth service)
 *     description: A protected route that requires authentication
 *     tags: [Auth Service (Proxied)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access granted to protected route"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Gateway health check endpoint
 *     description: Returns the health status of the SFL Gateway
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Gateway is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */

/**
 * @swagger
 * /leagues:
 *   get:
 *     summary: Get user's leagues (proxied to league service)
 *     description: Returns all leagues for the authenticated user. This request is proxied to the league service.
 *     tags: [Leagues (Proxied)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's leagues
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new league (proxied to league service)
 *     description: Creates a new league. This request is proxied to the league service.
 *     tags: [Leagues (Proxied)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: League created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /leagues/{id}:
 *   get:
 *     summary: Get league details (proxied to league service)
 *     description: Returns details for a specific league. This request is proxied to the league service.
 *     tags: [Leagues (Proxied)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: League details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: League not found
 */

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = (): void => {
    app.listen(config.port, () => {
        console.log(`🚀 SFL Gateway running on port ${config.port}`);
        console.log(`📖 API Documentation available at http://localhost:${config.port}/api-docs`);
        console.log(`📡 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Auth Service: ${config.authServiceUrl}`);
        console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
    });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

export default app;
