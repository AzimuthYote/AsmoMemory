import axios from 'axios';
import { Client } from '@notionhq/client';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:3000/api';

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate-key`, { apiKey });
    return response.data.success;
  } catch (error) {
    console.error('API Key validation failed:', error);
    return false;
  }
}

export async function fetchDatabases(apiKey: string): Promise<any[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/databases`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.data.databases;
  } catch (error) {
    console.error('Failed to fetch databases:', error);
    throw error;
  }
}

export async function configureWebhook(apiKey: string, config: {
  url: string;
  events: string[];
  databaseId: string;
}): Promise<boolean> {
  try {
    const response = await axios.post(`${API_BASE_URL}/webhook`, config, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.data.success;
  } catch (error) {
    console.error('Failed to configure webhook:', error);
    return false;
  }
}