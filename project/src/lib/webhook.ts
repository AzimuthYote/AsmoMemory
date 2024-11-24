import { io, Socket } from 'socket.io-client';
import { nanoid } from 'nanoid';
import { NotionClient } from './notion';

export interface WebhookConfig {
  id: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  lastPinged?: string;
}

export interface WebhookRequest {
  type: 'query' | 'create' | 'update' | 'delete';
  database: string;
  data?: any;
  pageId?: string;
}

class WebhookManager {
  private socket: Socket | null = null;
  private webhookId: string;
  private listeners: Set<(data: any) => void>;
  private notionClient: NotionClient | null = null;

  constructor() {
    this.webhookId = nanoid();
    this.listeners = new Set();
  }

  setNotionClient(client: NotionClient) {
    this.notionClient = client;
  }

  connect(url: string = '') {
    if (this.socket?.connected) return;

    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:3000';

    this.socket = io(socketUrl, {
      auth: { webhookId: this.webhookId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupListeners();
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  private async handleRequest(request: WebhookRequest) {
    if (!this.notionClient) {
      throw new Error('Notion client not initialized');
    }

    switch (request.type) {
      case 'query':
        return await this.notionClient.queryDatabase(request.database, request.data);
      case 'create':
        return await this.notionClient.createPage(request.database, request.data);
      case 'update':
        if (!request.pageId) throw new Error('Page ID required for update');
        return await this.notionClient.updatePage(request.pageId, request.data);
      case 'delete':
        if (!request.pageId) throw new Error('Page ID required for delete');
        return await this.notionClient.deletePage(request.pageId);
      default:
        throw new Error('Invalid request type');
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to webhook server');
    });

    this.socket.on('webhook:ping', (data) => {
      this.notifyListeners({ type: 'ping', data });
    });

    this.socket.on('webhook:request', async (request: WebhookRequest) => {
      try {
        const response = await this.handleRequest(request);
        this.socket?.emit('webhook:response', { success: true, data: response });
        this.notifyListeners({ type: 'request', request, response });
      } catch (error) {
        this.socket?.emit('webhook:response', { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        this.notifyListeners({ type: 'error', request, error });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from webhook server');
    });
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(listener => listener(data));
  }

  getWebhookUrl() {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:3000';
    return `${baseUrl}/api/webhook/${this.webhookId}`;
  }
}

export const webhookManager = new WebhookManager();