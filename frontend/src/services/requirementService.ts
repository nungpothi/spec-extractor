import axios from 'axios';
import type {
  ApiResponse,
  CreateRequirementRequest,
  UpdateRequirementRequest,
  CreateRequirementResponse,
  RequirementItem,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class RequirementService {
  static async createRequirement(data: CreateRequirementRequest): Promise<CreateRequirementResponse> {
    const response = await api.post<ApiResponse<CreateRequirementResponse>>('/requirements', data);

    if (response.data.status && response.data.results.length > 0) {
      return response.data.results[0];
    }

    throw new Error(response.data.errors.join(', ') || 'Failed to create requirement');
  }

  static async updateRequirement(id: string, data: UpdateRequirementRequest): Promise<CreateRequirementResponse> {
    const response = await api.put<ApiResponse<CreateRequirementResponse>>(`/requirements/${id}`, data);

    if (response.data.status && response.data.results.length > 0) {
      return response.data.results[0];
    }

    throw new Error(response.data.errors.join(', ') || 'Failed to update requirement');
  }

  static async getAllRequirements(): Promise<RequirementItem[]> {
    const response = await api.get<ApiResponse<RequirementItem>>('/requirements');

    if (response.data.status) {
      return response.data.results;
    }

    throw new Error(response.data.errors.join(', ') || 'Failed to fetch requirements');
  }
}
