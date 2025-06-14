import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        [key: string]: any;
    };
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; [key: string]: any; };
        req.user = decoded;
        
        // Forward user info to downstream services via headers
        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-email'] = decoded.email || '';
        
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};

export const optionalAuth = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; [key: string]: any; };
            req.user = decoded;
            
            // Forward user info to downstream services via headers
            req.headers['x-user-id'] = decoded.userId;
            req.headers['x-user-email'] = decoded.email || '';
        } catch {
            // Token is invalid, but we continue without setting user
        }
    }

    next();
};
