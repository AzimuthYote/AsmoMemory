// core/storeRecall.js

import callNotionAPI from '../utils/callNotionAPI.js';

/**
 * Stores a chat memory in Notion database.
 *
 * @param {Object} data - The data object containing chat message details.
 * @returns {Promise<Object>} - A promise that resolves to the response from the Notion API.
 */
export async function storeChatMemory(data) {
  const { chat_message, inference, key_words, hexcode, memory_area_id, timestamp } = data;

  const body = {
    parent: { database_id: process.env.CHAT_MEMORIES_DB },
    properties: {
      'chat_message': { title: [{ text: { content: chat_message } }] },
      'inference': { rich_text: [{ text: { content: inference } }] },
      'key_words': { multi_select: key_words.map(keyword => ({ name: keyword })) },
      'hexcode': { rich_text: [{ text: { content: hexcode } }] },
      'memory_area_id': { relation: [{ id: memory_area_id }] },
      'timestamp': { date: { start: timestamp } },
    },
  };

  try {
    return await callNotionAPI('/pages', 'POST', body);
  } catch (error) {
    throw new Error(`Failed to store chat memory: ${error.message}`);
  }
}

/**
 * Recalls chat memories based on keywords from Notion database.
 *
 * @param {Array<string>} keywords - An array of keywords to filter the chat memories.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of recalled memories.
 */
export async function recallChatMemories(keywords) {
  try {
    const response = await callNotionAPI(`/databases/${process.env.CHAT_MEMORIES_DB}/query`, 'POST', {
      filter: {
        or: keywords.map(keyword => ({
          property: 'key_words',
          multi_select: { contains: keyword },
        })),
      },
      page_size: 10,
    });

    return response.results;
  } catch (error) {
    throw new Error(`Failed to recall chat memories: ${error.message}`);
  }
}

/**
 * Tests the store and recall operations.
 *
 * @param {Object} data - The data object containing chat message details for testing.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of recalled memories.
 */
export async function testStoreAndRecall(data) {
  try {
    // Store the chat memory
    await storeChatMemory(data);

    // Recall using keywords
    const recalledMemories = await recallChatMemories(data.key_words);
    return recalledMemories;
  } catch (error) {
    throw new Error(`Error in store and recall operation: ${error.message}`);
  }
}
