import { Client } from '@notionhq/client';

export class NotionClient {
  constructor(token) {
    this.client = new Client({ auth: token });
  }

  async queryDatabase(databaseId, query = {}) {
    return await this.client.databases.query({
      database_id: databaseId,
      ...query,
    });
  }

  async createPage(databaseId, properties) {
    return await this.client.pages.create({
      parent: { database_id: databaseId },
      properties,
    });
  }

  async updatePage(pageId, properties) {
    return await this.client.pages.update({
      page_id: pageId,
      properties,
    });
  }

  async deletePage(pageId) {
    return await this.client.pages.update({
      page_id: pageId,
      archived: true,
    });
  }
}

export async function validateNotionToken(token) {
  try {
    const client = new Client({ auth: token });
    const response = await client.users.me();
    return !!response;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}