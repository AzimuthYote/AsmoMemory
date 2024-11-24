import { Router } from 'express';
import { Client } from '@notionhq/client';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = Router();

const databaseSchema = z.object({
  databaseId: z.string().min(1, 'Database ID is required')
});

router.get('/:databaseId/properties', async (req, res) => {
  try {
    const apiKey = req.headers.authorization?.split(' ')[1];
    if (!apiKey) {
      throw new Error('No API key provided');
    }

    const { databaseId } = databaseSchema.parse({ databaseId: req.params.databaseId });
    const notion = new Client({ auth: apiKey });

    const database = await notion.databases.retrieve({ database_id: databaseId });
    const properties = Object.entries(database.properties).map(([key, value]) => ({
      id: key,
      name: key,
      type: value.type,
      description: ''
    }));

    logger.info(`Properties fetched successfully for database ${databaseId}`);
    res.json({ success: true, properties });
  } catch (error) {
    logger.error('Failed to fetch database properties', error);
    res.status(401).json({
      success: false,
      error: 'Failed to fetch database properties'
    });
  }
});

export { router as databaseRouter };