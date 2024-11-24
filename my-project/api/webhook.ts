import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';
import { z } from 'zod';

const webhookConfigSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  databaseId: z.string().min(1, 'Database ID is required')
});

let detectedWebhook = '';
let isListening = false;
const webhookConfigs = new Map<string, { url: string; events: string[] }>();

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