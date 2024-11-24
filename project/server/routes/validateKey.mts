import { Router } from 'express';
import { Client } from '@notionhq/client';
import { z } from 'zod';
import { logger } from '../utils/logger.mjs';

const router = Router();

const apiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required')
});

router.post('/validate-key', async (req, res) => {
  try {
    logger.info('Validating API key');
    const { apiKey } = apiKeySchema.parse(req.body);

    // Initialize Notion client with provided API key
    const notion = new Client({ 
      auth: apiKey,
      notionVersion: '2022-06-28'
    });

    // Test the API key by making a simple search request
    const response = await notion.search({
      query: '',
      page_size: 1
    });

    logger.info('API key validated successfully');
    res.json({ 
      success: true,
      results: response.results.length
    });
  } catch (error) {
    // Safely handle and log errors
    if (error instanceof z.ZodError) {
      logger.error('Invalid request format:', error.issues);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request format'
      });
    }

    // Handle Notion API errors
    if (error.code === 'unauthorized') {
      logger.error('Invalid API key');
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid API key'
      });
    }

    logger.error('API key validation failed:', { 
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({ 
      success: false, 
      error: 'Failed to validate API key'
    });
  }
});

export { router as validateKeyRouter };