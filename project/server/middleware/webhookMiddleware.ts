import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.mjs';

interface WebhookRequest extends Request {
  webhookData?: {
    timestamp: string;
    event: string;
    databaseId: string;
    changes: Record<string, any>;
  };
}

export const validateWebhookRequest = (
  req: WebhookRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { timestamp, event, databaseId, changes } = req.body;

    if (!timestamp || !event || !databaseId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required webhook parameters'
      });
    }

    // Attach validated data to request object
    req.webhookData = {
      timestamp,
      event,
      databaseId,
      changes: changes || {}
    };

    logger.info('Webhook request validated', { event, databaseId });
    next();
  } catch (error) {
    logger.error('Webhook validation failed', error);
    res.status(400).json({
      success: false,
      error: 'Invalid webhook request format'
    });
  }
};

export const rateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Implement rate limiting logic here if needed
  next();
};