import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
  });

  // Operational errors (expected errors)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.constructor.name,
      message: err.message,
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma errors
  if ('code' in err && typeof err.code === 'string' && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Database Error',
      message: 'Invalid database operation',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token expired',
    });
  }

  // Unexpected errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
