import api from './api';
import { Template, CreateTemplateRequest, UpdateTemplateRequest, TemplateListItem } from '@/types/template';
import { ApiResponseWrapper } from '@/types/api';

export class TemplateService {
  private static baseUrl = '/template';

  static async getAll(): Promise<TemplateListItem[]> {
    const response = await api.get<ApiResponseWrapper<TemplateListItem[]>>(`${this.baseUrl}/list`);
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to fetch templates');
    }
    
    return response.data.default.results;
  }

  static async getById(id: string): Promise<Template> {
    const response = await api.get<ApiResponseWrapper<Template>>(`${this.baseUrl}/${id}`);
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to fetch template');
    }
    
    return response.data.default.results;
  }

  static async create(data: CreateTemplateRequest): Promise<{ id: string }> {
    const response = await api.post<ApiResponseWrapper<{ id: string }>>(`${this.baseUrl}/create`, data);
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to create template');
    }
    
    return response.data.default.results;
  }

  static async update(id: string, data: UpdateTemplateRequest): Promise<void> {
    const response = await api.put<ApiResponseWrapper<{}>>(`${this.baseUrl}/update/${id}`, data);
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to update template');
    }
  }

  static async delete(id: string): Promise<void> {
    const response = await api.delete<ApiResponseWrapper<{}>>(`${this.baseUrl}/delete/${id}`);
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to delete template');
    }
  }
}