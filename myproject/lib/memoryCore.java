// lib/memoryCore.js
import { Client } from '@notionhq/client';

// Initialize Notion client with token from environment variables
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Database IDs
const DB_CHAT_MEMORIES = process.env.DB_CHAT_MEMORIES;
const DB_MEMORY_AREAS = process.env.DB_MEMORY_AREAS;

// Function to store a new chat message in ChatMemories
export async function storeMessage(message, keywords = [], inference = '', hexcode = '', memoryAreaId = null) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: DB_CHAT_MEMORIES },
      properties: {
        chat_message: { title: [{ text: { content: message } }] },
        key_words: { multi_select: keywords.map(word => ({ name: word })) },
        inference: { rich_text: [{ text: { content: inference } }] },
        hexcode: { rich_text: [{ text: { content: hexcode } }] },
        timestamp: { date: { start: new Date().toISOString() } },
        memory_area_id: memoryAreaId ? { relation: [{ id: memoryAreaId }] } : undefined,
      },
    });
    return response;
  } catch (error) {
    console.error('Error storing message:', error);
    throw new Error('Failed to store message in ChatMemories');
  }
}

// Function to retrieve memories from ChatMemories
export async function retrieveMemories(keywords = [], memoryAreaId = null, startDate = null, endDate = null) {
  try {
    let filters = [];
    if (keywords.length > 0) {
      filters.push({
        property: 'key_words',
        multi_select: { contains: keywords[0] },
      });
    }
    if (memoryAreaId) {
      filters.push({
        property: 'memory_area_id',
        relation: { contains: memoryAreaId },
      });
    }
    if (startDate || endDate) {
      filters.push({
        property: 'timestamp',
        date: {
          ...(startDate ? { after: startDate.toISOString() } : {}),
          ...(endDate ? { before: endDate.toISOString() } : {}),
        },
      });
    }
    const response = await notion.databases.query({
      database_id: DB_CHAT_MEMORIES,
      filter: filters.length > 0 ? { and: filters } : undefined,
      sorts: [{ property: 'timestamp', direction: 'descending' }],
    });
    return response.results;
  } catch (error) {
    console.error('Error retrieving memories:', error);
    throw new Error('Failed to retrieve memories from ChatMemories');
  }
}

// Function to assign or create a memory area in MemoryAreas
export async function assignMemoryArea(areaName) {
  try {
    const existingArea = await notion.databases.query({
      database_id: DB_MEMORY_AREAS,
      filter: { property: 'Area', title: { equals: areaName } },
    });
    if (existingArea.results.length > 0) {
      return existingArea.results[0].id;
    } else {
      const response = await notion.pages.create({
        parent: { database_id: DB_MEMORY_AREAS },
        properties: {
          Area: { title: [{ text: { content: areaName } }] },
        },
      });
      return response.id;
    }
  } catch (error) {
    console.error('Error assigning memory area:', error);
    throw new Error('Failed to assign memory area');
  }
}

export { storeMessage, retrieveMemories, assignMemoryArea };
