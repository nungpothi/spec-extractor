import axios from 'axios';
import type {
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
} from '../types';

// Read VITE_API_URL from import.meta.env (Vite injects VITE_* env vars at build time)
const API_BASE = ((import.meta as any)?.env?.VITE_API_URL as string) || 'http://localhost:8000';
console.log('DEBUG: API_BASE', API_BASE);
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

export class AuthService {
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.results[0];
  }

  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Login failed');
    }
    const result = response.data.results[0];

    // Store token in localStorage
    localStorage.setItem('auth_token', result.token);

    return result;
  }

  static async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>('/auth/me');
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to get profile');
    }
    return response.data.results[0];
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
