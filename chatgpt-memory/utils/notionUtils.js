// Import the Notion client
const { Client } = require('@notionhq/client');

// Initialize Notion Client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Utility function to query a database and return results
async function queryDatabase(databaseId, filters = {}, sorts = [], pageSize = 100) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filters,
      sorts: sorts,
      page_size: pageSize,
    });
    return response.results;
  } catch (error) {
    console.error(`Error querying database ${databaseId}:`, error);
    throw new Error(`Failed to query database ${databaseId}`);
  }
}

// Utility function to create a page in a database
async function createPage(databaseId, properties) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
    });
    return response;
  } catch (error) {
    console.error(`Error creating page in database ${databaseId}:`, error);
    throw new Error(`Failed to create page in database ${databaseId}`);
  }
}

// Utility function to update a page's properties
async function updatePage(pageId, properties) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    return response;
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error);
    throw new Error(`Failed to update page ${pageId}`);
  }
}

// Utility function to retrieve a page by ID
async function retrievePage(pageId) {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error(`Error retrieving page ${pageId}:`, error);
    throw new Error(`Failed to retrieve page ${pageId}`);
  }
}

// Utility function to find a page in a database by a given property
async function findPageByProperty(databaseId, propertyName, propertyValue) {
  try {
    const filters = {
      property: propertyName,
      text: { equals: propertyValue },
    };
    const pages = await queryDatabase(databaseId, filters);
    return pages.length > 0 ? pages[0] : null;  // Return the first matching page
  } catch (error) {
    console.error(`Error finding page by property ${propertyName}:`, error);
    throw new Error(`Failed to find page by property ${propertyName}`);
  }
}

// Utility function to check if a value exists in a multi-select property
async function checkMultiSelectValue(databaseId, multiSelectProperty, value) {
  try {
    const filters = {
      property: multiSelectProperty,
      multi_select: { contains: value },
    };
    const pages = await queryDatabase(databaseId, filters);
    return pages.length > 0;
  } catch (error) {
    console.error(`Error checking multi-select value for ${multiSelectProperty}:`, error);
    throw new Error(`Failed to check multi-select value for ${multiSelectProperty}`);
  }
}

// Utility function to create a new memory in the 'ChatMemories' database
async function storeMemory(memoryData) {
  const { message, keywords, inference, hexcode, memoryAreaId, groupcode, timestamp } = memoryData;
  try {
    const properties = {
      chat_message: { title: [{ text: { content: message } }] },
      key_words: { multi_select: keywords.map(word => ({ name: word })) },
      inference: { rich_text: [{ text: { content: inference } }] },
      hexcode: { rich_text: [{ text: { content: hexcode } }] },
      timestamp: { date: { start: timestamp } },
      memory_area_id: memoryAreaId ? { relation: [{ id: memoryAreaId }] } : undefined,
      groupcode: { rich_text: [{ text: { content: groupcode } }] },
    };

    const response = await createPage(process.env.DB_CHAT_MEMORIES, properties);
    return response;
  } catch (error) {
    console.error('Error storing memory:', error);
    throw new Error('Failed to store memory');
  }
}

module.exports = {
  queryDatabase,
  createPage,
  updatePage,
  retrievePage,
  findPageByProperty,
  checkMultiSelectValue,
  storeMemory,
};
