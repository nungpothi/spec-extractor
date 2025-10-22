export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  results: T[];
  errors: string[];
}

export interface SpecSummary {
  id: string;
  summary: string;
  created_at: string;
}

export interface SpecDetail {
  id: string;
  json_data: object;
  preview_html: string;
}

export interface CreateSpecRequest {
  json_data: object;
}

export interface CreateSpecResponse {
  id: string;
}

export interface PreviewRequest {
  json_data: object;
}

export interface PreviewResponse {
  html: string;
}

// Authentication Types
export interface RegisterRequest {
  phone: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  role: string;
}

export type UserRole = 'ADMIN' | 'VISITOR';

// Requirement Types
export interface CreateRequirementRequest {
  content: string;
  is_private: boolean;
}

export interface CreateRequirementResponse {
  id: string;
}

export interface RequirementItem {
  id: string;
  content: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
}