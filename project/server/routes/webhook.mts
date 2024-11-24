import { Router } from 'express';
import { Client } from '@notionhq/client';
import { z } from 'zod';
import { logger } from '../utils/logger.mjs';
import { validateWebhookRequest, rateLimit } from '../middleware/webhookMiddleware.js';

const router = Router();

const webhookConfigSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  databaseId: z.string().min(1, 'Database ID is required')
});

let detectedWebhook = '';
let isListening = false;
let webhookConfigs: Map<string, { url: string; events: string[] }> = new Map();

// Endpoint to handle incoming webhook events
router.post('/', validateWebhookRequest, rateLimit, async (req, res) => {
  try {
    if (isListening && req.headers.referer) {
      detectedWebhook = req.headers.referer;
      logger.info('Detected webhook URL:', detectedWebhook);
    }

    const { webhookData } = req as any;
    const config = webhookConfigs.get(webhookData.databaseId);

    if (!config) {
      logger.warn('No webhook configuration found for database', webhookData.databaseId);
      return res.status(404).json({
        success: false,
        error: 'No webhook configuration found for this database'
      });
    }

    if (!config.events.includes(webhookData.event)) {
      logger.info('Event not configured for webhook', {
        event: webhookData.event,
        configuredEvents: config.events
      });
      return res.status(200).json({ success: true, message: 'Event ignored' });
    }

    // Forward the webhook to the configured URL
    const response = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error('Failed to forward webhook');
    }

    logger.info('Webhook forwarded successfully', {
      event: webhookData.event,
      databaseId: webhookData.databaseId
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook event', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook event'
    });
  }
});

// Start listening mode
router.post('/listen', async (req, res) => {
  try {
    detectedWebhook = '';
    isListening = true;
    logger.info('Started listening for webhook URL');

    // Listen for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    isListening = false;
    
    if (detectedWebhook) {
      res.json({ 
        success: true,
        webhookUrl: detectedWebhook
      });
    } else {
      res.json({
        success: false,
        message: 'No webhook detected during listening period'
      });
    }
  } catch (error) {
    logger.error('Error in listening mode', error);
    res.status(500).json({
      success: false,
      error: 'Failed to listen for webhook'
    });
  }
});

router.post('/configure', async (req, res) => {
  try {
    const apiKey = req.headers.authorization?.split(' ')[1];
    if (!apiKey) {
      throw new Error('No API key provided');
    }

    const config = webhookConfigSchema.parse(req.body);
    const notion = new Client({ auth: apiKey });

    // Verify database access
    await notion.databases.retrieve({ database_id: config.databaseId });

    // Test webhook URL
    const testResponse = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'TEST',
        databaseId: config.databaseId,
        timestamp: new Date().toISOString()
      })
    });

    if (!testResponse.ok) {
      throw new Error('Failed to reach webhook URL');
    }

    // Store the webhook configuration
    webhookConfigs.set(config.databaseId, {
      url: config.url,
      events: config.events
    });

    logger.info('Webhook configured successfully', { 
      databaseId: config.databaseId,
      events: config.events 
    });

    res.json({ 
      success: true,
      message: 'Webhook configured successfully'
    });
  } catch (error) {
    logger.error('Webhook configuration failed', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to configure webhook'
    });
  }
});

export { router as webhookRouter };