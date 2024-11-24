import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}