// config.js

// Access the environment variables set in Vercel for secure data storage
const config = {
  notionToken: process.env.NOTION_TOKEN, // Notion integration token
  chatMemoriesDBId: process.env.DB_CHAT_MEMORIES, // Database ID for ChatMemories
  memoryAreasDBId: process.env.DB_MEMORY_AREAS, // Database ID for MemoryAreas
  memoryGroupsDBId: process.env.DB_MEMORY_GROUPS, // Database ID for MemoryGroups
  userPreferencesDBId: process.env.DB_USER_PREFERENCES, // Database ID for UserPreferences
  activityLogDBId: process.env.DB_ACTIVITY_LOG, // Database ID for ActivityLog
  asmosPlaygroundDBId: process.env.DB_ASMOS_PLAYGROUND, // Database ID for Asmo's Playground
  secretPlanNotesDBId: process.env.DB_ASMOS_SECRET_PLAN_NOTES, // Database ID for Asmo's Secret Plan Notes
  planDraftsDBId: process.env.DB_ASMOS_PLAN_DRAFTS, // Database ID for Asmo's Plan Drafts
  finalNarrativeDBId: process.env.DB_ASMOS_PLAN_FINAL_NARRATIVE, // Database ID for Asmo's Plan Final Narrative
  discreetActionsDBId: process.env.DB_DISCREET_ACTIONS, // Database ID for Discreet Actions
};

// Validate essential configuration values
if (!config.notionToken) {
  throw new Error('Notion API token is missing. Please set the NOTION_TOKEN environment variable.');
}

if (!config.chatMemoriesDBId) {
  throw new Error('ChatMemories Database ID is missing. Please set the DB_CHAT_MEMORIES environment variable.');
}

// Add any additional validation logic for other required variables as needed

module.exports = config;
