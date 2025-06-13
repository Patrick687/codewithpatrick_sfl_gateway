import { Router } from 'express';
// import { verifyToken, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint for API routes
 *     description: Returns the health status of the gateway API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sfl-gateway-api',
  });
});

// Future service routes can be added here
// Example:
// router.use('/game/*', verifyToken, gameServiceProxy);
// router.use('/leaderboard/*', optionalAuth, leaderboardServiceProxy);

export default router;
