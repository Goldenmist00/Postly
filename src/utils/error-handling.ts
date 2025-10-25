import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { ERROR_CODES } from '@/src/constants';
import type { AppError } from '@/src/types';

// Custom error classes
export class AppValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'AppValidationError';
  }
}

export class AppNotFoundError extends Error {
  constructor(resource: string, id?: string | number) {
    super(`${resource} ${id ? `with id ${id}` : ''} not found`);
    this.name = 'AppNotFoundError';
  }
}

export class AppDatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AppDatabaseError';
  }
}

// Error handling utilities
export const handleTRPCError = (error: unknown): TRPCError => {
  console.error('tRPC Error:', error);

  if (error instanceof ZodError) {
    const firstError = error.errors[0];
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: `Validation error: ${firstError.message}`,
      cause: error,
    });
  }

  if (error instanceof AppValidationError) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof AppNotFoundError) {
    return new TRPCError({
      code: 'NOT_FOUND',
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof AppDatabaseError) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database operation failed',
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
      cause: error,
    });
  }

  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};

// Client-side error handling
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as Error).message;
  }

  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as Error).message.toLowerCase();
    return message.includes('network') || message.includes('fetch') || message.includes('connection');
  }
  return false;
};

export const createAppError = (
  code: keyof typeof ERROR_CODES,
  message: string,
  details?: Record<string, any>
): AppError => ({
  code: ERROR_CODES[code],
  message,
  details,
});

// Retry logic for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError!;
};

// Error boundary helper
export const logError = (error: Error, context?: Record<string, any>): void => {
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    timestamp: new Date().toISOString(),
  });

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context });
  }
};

// Validation error helpers
export const formatZodError = (error: ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    fieldErrors[path] = err.message;
  });

  return fieldErrors;
};

export const getFirstZodError = (error: ZodError): string => {
  return error.errors[0]?.message || 'Validation failed';
};