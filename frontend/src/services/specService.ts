import axios from 'axios';
import type {
  ApiResponse,
  SpecSummary,
  SpecDetail,
  CreateSpecRequest,
  CreateSpecResponse,
  PreviewRequest,
  PreviewResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class SpecService {
  static async getAllSpecs(): Promise<SpecSummary[]> {
    const response = await api.get<ApiResponse<SpecSummary>>('/specs');
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch specifications');
    }
    return response.data.results;
  }

  static async getSpecById(id: string): Promise<SpecDetail> {
    const response = await api.get<ApiResponse<SpecDetail>>(`/specs/${id}`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch specification');
    }
    return response.data.results[0];
  }

  static async createSpec(data: CreateSpecRequest): Promise<CreateSpecResponse> {
    const response = await api.post<ApiResponse<CreateSpecResponse>>('/specs', data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to create specification');
    }
    return response.data.results[0];
  }

  static async deleteSpec(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/specs/${id}`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to delete specification');
    }
  }

  static async previewJson(data: PreviewRequest): Promise<PreviewResponse> {
    const response = await api.post<ApiResponse<PreviewResponse>>('/preview', data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to preview JSON');
    }
    return response.data.results[0];
  }
}
