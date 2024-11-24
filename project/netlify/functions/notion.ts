import { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';

export const handler: Handler = async (event) => {
  if (!event.headers.cookie?.includes('asmo_session')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const notionToken = event.headers['x-notion-token'];
  if (!notionToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Notion token required' }),
    };
  }

  try {
    const notion = new Client({ auth: notionToken });
    const response = await notion.search({
      filter: { property: 'object', value: 'database' },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        databases: response.results.map((db: any) => ({
          id: db.id,
          name: db.title[0]?.plain_text || 'Untitled',
          icon: db.icon?.emoji || '📄',
        })),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch databases' }),
    };
  }
}