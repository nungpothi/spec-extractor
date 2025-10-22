import axios from 'axios';
import { ApiResponse, GenerateWebhookResponse, WebhookLog } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const webhookService = {
  async generateWebhook(): Promise<{ status: boolean; results: GenerateWebhookResponse[]; message: string; errors: string[] }> {
    const response = await api.post<{ default: ApiResponse<GenerateWebhookResponse> }>('/api/webhook/generate');
    return response.data.default;
  },

  async getWebhookLogs(webhookId: string): Promise<{ status: boolean; results: WebhookLog[]; message: string; errors: string[] }> {
    const response = await api.get<{ default: ApiResponse<WebhookLog> }>(`/api/webhook/${webhookId}/logs`);
    return response.data.default;
  },
};