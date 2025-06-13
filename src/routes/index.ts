import { Router } from 'express';
import { authServiceProxy } from '../proxy';
// import { verifyToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sfl-gateway'
    });
});

// Auth service routes - these will be proxied to the auth service
// Public routes (no authentication required)
router.use('/auth/health', authServiceProxy);
router.use('/auth/register', authServiceProxy);
router.use('/auth/login', authServiceProxy);
router.use('/auth/google', authServiceProxy);
router.use('/auth/google/callback', authServiceProxy);

// Protected routes (authentication required)
// Note: The auth verification is handled by the auth service itself
// But we could add gateway-level auth verification here if needed
router.use('/auth/change-password', authServiceProxy);
router.use('/auth/protected', authServiceProxy);

// Future service routes can be added here
// Example:
// router.use('/game/*', verifyToken, gameServiceProxy);
// router.use('/leaderboard/*', optionalAuth, leaderboardServiceProxy);

export default router;
