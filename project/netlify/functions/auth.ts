import { Handler } from '@netlify/functions';
import { z } from 'zod';
import cookie from 'cookie';

const pinSchema = z.string().length(4).regex(/^\d+$/);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { pin } = JSON.parse(event.body || '{}');
    pinSchema.parse(pin);

    if (pin !== process.env.VITE_PIN) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid PIN' }),
      };
    }

    const sessionId = crypto.randomUUID();
    const cookieHeader = cookie.serialize('asmo_session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': cookieHeader,
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  }
}