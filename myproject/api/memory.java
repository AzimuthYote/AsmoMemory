// api/memory.js
import { storeMessage, retrieveMemories, assignMemoryArea } from '../lib/memoryCore';

export default async function handler(req, res) {
  // Check if the request includes the correct API key
  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid API Key' });
  }

  if (req.method === 'POST') {
    const { message, keywords, inference, hexcode, areaName } = req.body;

    try {
      const memoryAreaId = areaName ? await assignMemoryArea(areaName) : null;
      const storedMessage = await storeMessage(message, keywords, inference, hexcode, memoryAreaId);
      res.status(200).json({ success: true, data: storedMessage });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
