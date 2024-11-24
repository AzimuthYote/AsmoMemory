import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ success: false, error: 'API key is required' });
  }

  try {
    const notion = new Client({ auth: apiKey });
    await notion.search({ query: '' });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
}