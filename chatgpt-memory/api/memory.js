import { Client } from '@notionhq/client';

// Initialize the Notion client using the token stored in environment variables
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define the Notion database ID for storing chat memories
const DB_CHAT_MEMORIES = process.env.DB_CHAT_MEMORIES;
const DB_MEMORY_AREAS = process.env.DB_MEMORY_AREAS;
const DB_MEMORY_GROUPS = process.env.DB_MEMORY_GROUPS;

// Utility to store a chat message in the 'ChatMemories' database
async function storeMessage(message, keywords = [], inference = '', hexcode = '', memoryAreaId = null, groupCode = '') {
    try {
        // Creating a new memory in the ChatMemories database
        const response = await notion.pages.create({
            parent: { database_id: DB_CHAT_MEMORIES },
            properties: {
                chat_message: { title: [{ text: { content: message } }] },
                key_words: { multi_select: keywords.map(word => ({ name: word })) },
                inference: { rich_text: [{ text: { content: inference } }] },
                hexcode: { rich_text: [{ text: { content: hexcode } }] },
                timestamp: { date: { start: new Date().toISOString() } },
                memory_area_id: memoryAreaId ? { relation: [{ id: memoryAreaId }] } : undefined,
                memory_group_id: groupCode ? { rich_text: [{ text: { content: groupCode } }] } : undefined
            },
        });

        console.log('Memory stored successfully:', response);
        return response;
    } catch (error) {
        console.error('Error storing message:', error);
        throw new Error('Failed to store memory in ChatMemories');
    }
}

// Utility to retrieve relevant memories based on keywords or other filters
async function retrieveMemories(keywords = [], memoryAreaId = null, startDate = null, endDate = null) {
    try {
        // Construct filters for querying memories in the ChatMemories database
        let filters = [];

        if (keywords.length > 0) {
            filters.push({
                property: 'key_words',
                multi_select: {
                    contains: keywords[0],
                },
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

        console.log('Memories retrieved:', response.results);
        return response.results;
    } catch (error) {
        console.error('Error retrieving memories:', error);
        throw new Error('Failed to retrieve memories from ChatMemories');
    }
}

// Utility to create and manage memory groups by generating a Groupcode
async function createMemoryGroup(groupName, keywords = []) {
    try {
        const groupCode = generateGroupCode(keywords);

        const response = await notion.pages.create({
            parent: { database_id: DB_MEMORY_GROUPS },
            properties: {
                GroupName: { title: [{ text: { content: groupName } }] },
                Groupcode: { rich_text: [{ text: { content: groupCode } }] },
            },
        });

        console.log('Memory group created:', response);
        return response;
    } catch (error) {
        console.error('Error creating memory group:', error);
        throw new Error('Failed to create memory group');
    }
}

// Helper function to generate a unique group code based on keywords
function generateGroupCode(keywords = []) {
    return keywords.slice(0, 3).join('-').toLowerCase();
}

// Utility to assign a memory to a group
async function assignMemoryToGroup(memoryId, groupCode) {
    try {
        // Query existing groups by group code
        const existingGroup = await notion.databases.query({
            database_id: DB_MEMORY_GROUPS,
            filter: {
                property: 'Groupcode',
                rich_text: { equals: groupCode },
            },
        });

        if (existingGroup.results.length > 0) {
            const groupId = existingGroup.results[0].id;
            // If the group exists, add memory ID to the group
            await notion.pages.update({
                page_id: groupId,
                properties: {
                    ChatMemories: {
                        relation: [{ id: memoryId }],
                    },
                },
            });

            console.log('Memory assigned to existing group:', groupId);
        } else {
            // If no group exists, create a new group
            await createMemoryGroup(groupCode, [groupCode]);
            console.log('New memory group created and memory assigned.');
        }
    } catch (error) {
        console.error('Error assigning memory to group:', error);
        throw new Error('Failed to assign memory to group');
    }
}

// Expose functions to be used in other modules
export { storeMessage, retrieveMemories, createMemoryGroup, assignMemoryToGroup };
