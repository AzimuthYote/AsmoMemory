import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';
import { z } from 'zod';

const webhookConfigSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  databaseId: z.string().min(1, 'Database ID is required'),
  manualContent: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const apiKey = req.headers.authorization?.split(' ')[1];
    
    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'No API key provided' });
    }

    try {
      const config = webhookConfigSchema.parse(req.body);
      const notion = new Client({ auth: apiKey });

      // Verify database access
      await notion.databases.retrieve({ database_id: config.databaseId });

      // Send manual content first if provided
      if (config.manualContent) {
        const manualResponse = await fetch(config.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'manual',
            content: config.manualContent,
            databaseId: config.databaseId
          })
        });

        if (!manualResponse.ok) {
          throw new Error('Failed to send manual content');
        }
      }

      // Test webhook with database info
      const testResponse = await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test',
          databaseId: config.databaseId,
          events: config.events,
          timestamp: new Date().toISOString()
        })
      });

      if (!testResponse.ok) {
        throw new Error('Failed to reach webhook URL');
      }

      return res.status(200).json({
        success: true,
        message: 'Webhook configured successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to configure webhook'
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}