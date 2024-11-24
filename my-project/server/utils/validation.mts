import { z } from 'zod';

export const validateApiKey = z.object({
  apiKey: z.string().min(1, 'API key is required')
});

export const validateWebhook = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event type is required'),
  databaseId: z.string().min(1, 'Database ID is required')
});