import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
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
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret) as any;
            req.user = decoded;
        } catch (error) {
            // Token is invalid, but we continue without setting user
        }
    }

    next();
};
