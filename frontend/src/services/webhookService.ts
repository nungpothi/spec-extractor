import axios from 'axios';
import { ApiResponse, GenerateWebhookResponse, WebhookLog, WebhookItem } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const webhookService = {
  async generateWebhook(responseTemplate?: object): Promise<{ status: boolean; results: GenerateWebhookResponse[]; message: string; errors: string[] }> {
    const payload = responseTemplate ? { response_template: responseTemplate } : {};
    const response = await api.post<{ default: ApiResponse<GenerateWebhookResponse> }>('/api/webhook/generate', payload);
    return response.data.default;
  },

  async getUserWebhooks(): Promise<{ status: boolean; results: WebhookItem[]; message: string; errors: string[] }> {
    const response = await api.get<{ default: ApiResponse<WebhookItem> }>(`/api/webhook`);
    return response.data.default;
  },

  async getWebhookLogs(webhookId: string): Promise<{ status: boolean; results: WebhookLog[]; message: string; errors: string[] }> {
    const response = await api.get<{ default: ApiResponse<WebhookLog> }>(`/api/webhook/${webhookId}/logs`);
    return response.data.default;
  },

  async updateWebhookResponse(webhookId: string, responseTemplate: object): Promise<{ status: boolean; results: { uuid: string }[]; message: string; errors: string[] }> {
    const response = await api.put<{ default: ApiResponse<{ uuid: string }> }>(`/api/webhook/${webhookId}/response`, {
      response_template: responseTemplate
    });
    return response.data.default;
  },

  async deleteWebhookLog(logId: string): Promise<{ status: boolean; results: any[]; message: string; errors: string[] }> {
    const response = await api.delete<{ default: ApiResponse<any> }>(`/api/webhook/logs/${logId}`);
    return response.data.default;
  },
};
