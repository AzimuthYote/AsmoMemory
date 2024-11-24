import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = req.headers.authorization?.split(' ')[1];

  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'No API key provided' });
  }

  try {
    const notion = new Client({ auth: apiKey });
    const response = await notion.search({
      filter: { property: 'object', value: 'database' }
    });

    return res.status(200).json({
      success: true,
      databases: response.results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch databases'
    });
  }
}