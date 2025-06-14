// API response utilities using shared types
import { SuccessResponse, ErrorResponse, HealthCheckResponse } from '@sfl/shared-types';

/**
 * Create a standardized success response
 */
export const createSuccessResponse = <T>(data: T, message?: string): SuccessResponse<T> => ({
  success: true,
  data,
  message
});

/**
 * Create a standardized error response
 */
export const createErrorResponse = (error: string, message: string): ErrorResponse => ({
  success: false,
  error,
  message
});

/**
 * Create a health check response
 */
export const createHealthResponse = (
  service: string,
  version: string,
  status: 'ok' | 'error' = 'ok',
  dependencies?: Record<string, 'healthy' | 'unhealthy'>
): HealthCheckResponse => ({
  status,
  timestamp: new Date().toISOString(),
  service,
  version,
  uptime: process.uptime(),
  dependencies
});

/**
 * Type guard to check if a response is successful
 */
export const isSuccessResponse = <T>(response: any): response is SuccessResponse<T> => {
  return response && response.success === true && 'data' in response;
};

/**
 * Type guard to check if a response is an error
 */
export const isErrorResponse = (response: any): response is ErrorResponse => {
  return response && response.success === false && 'error' in response;
};
