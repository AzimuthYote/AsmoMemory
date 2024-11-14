// api/memory.js
import { storeMessage, assignMemoryArea } from '../lib/memoryCore';

export default async function handler(req, res) {
  // Step 1: API Key Authentication
  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid API Key' });
  }

  // Step 2: Verify Method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Step 3: Parse and Validate Input
  const { message, keywords = [], inference = '', hexcode = '', areaName = '' } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Bad Request: "message" is required' });
  }

  try {
    // Step 4: Assign Memory Area (if areaName provided)
    let memoryAreaId = null;
    if (areaName) {
      memoryAreaId = await assignMemoryArea(areaName);
    }

    // Step 5: Store Memory in Notion
    const storedMessage = await storeMessage(message, keywords, inference, hexcode, memoryAreaId);

    // Step 6: Return Success Response
    res.status(200).json({ success: true, data: storedMessage });
  } catch (error) {
    // Step 7: Handle Errors
    console.error('Error storing memory:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}
