export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: Record<string, any>;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  databaseId: string;
  manualContent?: string;
}

export interface NotionState {
  apiKey: string | null;
  selectedDatabase: NotionDatabase | null;
  manualContent: string;
  webhookUrl: string;
  isConfigured: boolean;
}