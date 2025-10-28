import axios from 'axios';
import type {
  ApiResponse,
  QuotationSummary,
  QuotationDetail,
  CreateQuotationRequest,
  CreateQuotationResponse,
  UpdateQuotationRequest,
  QuotationShareResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractResults = <T>(data: ApiResponse<T>): T[] => {
  const results = data.results as unknown;
  if (Array.isArray(results)) {
    return results as T[];
  }
  if (results) {
    return [results as T];
  }
  return [];
};

export class QuotationService {
  static async list(): Promise<QuotationSummary[]> {
    const response = await api.get<ApiResponse<QuotationSummary>>('/quotations');
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch quotations');
    }
    return extractResults(response.data);
  }

  static async getById(id: string): Promise<QuotationDetail> {
    const response = await api.get<ApiResponse<QuotationDetail>>(`/quotations/${id}`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch quotation');
    }
    const results = extractResults(response.data);
    if (results.length === 0) {
      throw new Error('Quotation not found');
    }
    return results[0];
  }

  static async create(data: CreateQuotationRequest): Promise<CreateQuotationResponse> {
    const response = await api.post<ApiResponse<CreateQuotationResponse>>('/quotations', data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to create quotation');
    }
    const results = extractResults(response.data);
    if (results.length === 0) {
      throw new Error('Quotation creation returned no data');
    }
    return results[0];
  }

  static async update(id: string, data: UpdateQuotationRequest): Promise<void> {
    const response = await api.put<ApiResponse<null>>(`/quotations/${id}`, data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to update quotation');
    }
  }

  static async downloadPdf(id: string): Promise<Blob> {
    const response = await api.get(`/quotations/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  static async getShareLink(id: string): Promise<QuotationShareResponse> {
    const response = await api.get<ApiResponse<QuotationShareResponse>>(`/quotations/${id}/share`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to generate share link');
    }
    const results = extractResults(response.data);
    if (results.length === 0) {
      throw new Error('Share link response returned no data');
    }
    return results[0];
  }
}
