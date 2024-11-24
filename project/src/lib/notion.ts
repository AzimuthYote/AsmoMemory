import { Client } from '@notionhq/client';
import { z } from 'zod';

export const DatabaseSchema = z.object({
  id: z.string(),
  title: z.array(
    z.object({
      text: z.object({
        content: z.string(),
      }),
    })
  ),
  properties: z.record(z.any()),
});

export type NotionDatabase = z.infer<typeof DatabaseSchema>;

export class NotionClient {
  private client: Client | null = null;

  initialize(token: string) {
    if (!token.startsWith('secret_')) {
      throw new Error('Invalid token format');
    }
    this.client = new Client({ auth: token });
  }

  async validateToken(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      const response = await this.client.users.me();
      return !!response;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async listDatabases() {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const response = await this.client.search({
        filter: { property: 'object', value: 'database' },
      });

      return response.results.map((db: any) => ({
        id: db.id,
        name: db.title[0]?.plain_text || 'Untitled',
        icon: db.icon?.emoji || '📄',
      }));
    } catch (error: any) {
      console.error('Failed to list databases:', error?.message || error);
      throw new Error(error?.message || 'Failed to fetch databases');
    }
  }

  async queryDatabase(databaseId: string, query: any = {}) {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...query,
      });
      return response;
    } catch (error) {
      console.error(`Failed to query database ${databaseId}:`, error);
      throw error;
    }
  }

  async createPage(databaseId: string, properties: any) {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const response = await this.client.pages.create({
        parent: { database_id: databaseId },
        properties,
      });
      return response;
    } catch (error) {
      console.error('Failed to create page:', error);
      throw error;
    }
  }

  async updatePage(pageId: string, properties: any) {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties,
      });
      return response;
    } catch (error) {
      console.error('Failed to update page:', error);
      throw error;
    }
  }

  async deletePage(pageId: string) {
    if (!this.client) throw new Error('Client not initialized');

    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        archived: true,
      });
      return response;
    } catch (error) {
      console.error('Failed to delete page:', error);
      throw error;
    }
  }
}