import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', error);

    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }

    if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
};
