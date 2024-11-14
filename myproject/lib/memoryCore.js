// lib/memoryCore.js
import { Client } from '@notionhq/client';

// Initialize Notion client with API token
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define Notion database IDs from environment variables
const DB_CHAT_MEMORIES = process.env.DB_CHAT_MEMORIES;
const DB_MEMORY_AREAS = process.env.DB_MEMORY_AREAS;

/**
 * Stores a chat message in the ChatMemories database.
 * @param {string} message - The main content of the memory to be stored.
 * @param {string[]} keywords - An array of keywords for categorization.
 * @param {string} inference - AI's interpretation of the message.
 * @param {string} hexcode - A hex color code tag.
 * @param {string|null} memoryAreaId - Relation ID to link to a memory area.
 * @returns {Promise<object>} The result of the stored message.
 */
export async function storeMessage(message, keywords = [], inference = '', hexcode = '', memoryAreaId = null) {
  try {
    // Format data for Notion's API structure
    const properties = {
      chat_message: { title: [{ text: { content: message } }] },
      key_words: { multi_select: keywords.map(word => ({ name: word })) },
      inference: { rich_text: [{ text: { content: inference } }] },
      hexcode: { rich_text: [{ text: { content: hexcode } }] },
      timestamp: { date: { start: new Date().toISOString() } },
    };

    // Add memory area relation if available
    if (memoryAreaId) {
      properties.memory_area_id = { relation: [{ id: memoryAreaId }] };
    }

    // Call Notion API to create a new page in ChatMemories database
    const response = await notion.pages.create({
      parent: { database_id: DB_CHAT_MEMORIES },
      properties,
    });

    return response; // Return successful response with page ID
  } catch (error) {
    console.error('Error storing message:', error);
    throw new Error('Failed to store message in ChatMemories');
  }
}

/**
 * Assigns a memory area in the MemoryAreas database.
 * Searches for an existing area by name or creates a new one if not found.
 * @param {string} areaName - The name of the memory area.
 * @returns {Promise<string>} The ID of the memory area.
 */
export async function assignMemoryArea(areaName) {
  try {
    // Search for existing memory area with the same name
    const searchResponse = await notion.databases.query({
      database_id: DB_MEMORY_AREAS,
      filter: { property: 'Area', title: { equals: areaName } },
    });

    // Return existing area ID if found
    if (searchResponse.results.length > 0) {
      return searchResponse.results[0].id;
    }

    // Create a new memory area if it doesn't exist
    const createResponse = await notion.pages.create({
      parent: { database_id: DB_MEMORY_AREAS },
      properties: {
        Area: { title: [{ text: { content: areaName } }] },
      },
    });

    return createResponse.id; // Return new area ID
  } catch (error) {
    console.error('Error assigning memory area:', error);
    throw new Error('Failed to assign memory area');
  }
}
