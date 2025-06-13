import { Request, Response, NextFunction } from 'express';
import { verifyToken, optionalAuth, AuthenticatedRequest } from '../../middleware/auth';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Mock jwt module
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Middleware', () => {
    let mockRequest: Partial<AuthenticatedRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyToken', () => {
        it('should return 401 if no token provided', () => {
            verifyToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Access token required' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 if token is invalid', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            mockedJwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            verifyToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should set user and call next if token is valid', () => {
            const decodedToken = { id: '123', email: 'test@example.com' };
            mockRequest.headers = { authorization: 'Bearer valid-token' };
            mockedJwt.verify.mockReturnValue(decodedToken);

            verifyToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toEqual(decodedToken);
            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('optionalAuth', () => {
        it('should continue without user if no token provided', () => {
            optionalAuth(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toBeUndefined();
            expect(mockNext).toHaveBeenCalled();
        });

        it('should continue without user if token is invalid', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            mockedJwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            optionalAuth(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toBeUndefined();
            expect(mockNext).toHaveBeenCalled();
        });

        it('should set user if token is valid', () => {
            const decodedToken = { id: '123', email: 'test@example.com' };
            mockRequest.headers = { authorization: 'Bearer valid-token' };
            mockedJwt.verify.mockReturnValue(decodedToken);

            optionalAuth(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toEqual(decodedToken);
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
