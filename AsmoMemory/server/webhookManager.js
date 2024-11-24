import { NotionClient } from './notionUtils.js';

export class WebhookManager {
  constructor(io) {
    this.io = io;
    this.webhooks = new Map();
    this.notionClients = new Map();
  }

  registerWebhook(webhookId, socket) {
    this.webhooks.set(webhookId, socket);
    
    // Set up socket event handlers
    socket.on('notion:setToken', (token) => {
      const notionClient = new NotionClient(token);
      this.notionClients.set(webhookId, notionClient);
    });
  }

  unregisterWebhook(webhookId) {
    this.webhooks.delete(webhookId);
    this.notionClients.delete(webhookId);
  }

  getWebhook(webhookId) {
    return this.webhooks.get(webhookId);
  }

  async handleWebhookRequest(webhookId, request) {
    const socket = this.webhooks.get(webhookId);
    const notionClient = this.notionClients.get(webhookId);

    if (!socket) {
      throw new Error('Webhook not connected');
    }

    if (!notionClient) {
      throw new Error('Notion client not initialized');
    }

    return new Promise((resolve, reject) => {
      socket.emit('webhook:request', request);

      // Wait for response with 30s timeout
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      socket.once('webhook:response', (response) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  broadcastEvent(webhookId, event, data) {
    const socket = this.webhooks.get(webhookId);
    if (socket) {
      socket.emit(event, data);
    }
  }
}