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

export interface UpdateRequirementRequest {
  content: string;
  is_private: boolean;
  status: string;
}

export interface CreateRequirementResponse {
  id: string;
  status?: string;
}

export interface RequirementItem {
  id: string;
  content: string;
  is_private: boolean;
  status: string;
  created_by: string;
  created_at: string;
}

export type RequirementStatus = 'NEW' | 'IN_PROGRESS' | 'DONE';

// Webhook Types
export interface GenerateWebhookResponse {
  uuid: string;
  url: string;
  response_template?: object | null;
}

export interface WebhookLog {
  id: string;
  method: string;
  headers: Record<string, any>;
  body: Record<string, any>;
  created_at: string;
}

export interface WebhookItem {
  id: string;
  uuid_key: string;
  url: string;
  response_template?: object | null;
  created_at: string;
}

// Quotation Types
export interface QuotationItemPayload {
  id?: string;
  name: string;
  qty: number;
  price: number;
  total?: number;
}

export interface QuotationSummary {
  id: string;
  companyName: string;
  clientName: string;
  total: number;
  includeVat: boolean;
  createdAt?: string;
}

export interface QuotationDetail extends QuotationSummary {
  note?: string;
  items: QuotationItemPayload[];
}

export interface CreateQuotationRequest {
  companyName: string;
  clientName: string;
  items: QuotationItemPayload[];
  includeVat: boolean;
  note?: string;
}

export interface UpdateQuotationRequest {
  companyName: string;
  clientName: string;
  items: QuotationItemPayload[];
  includeVat: boolean;
  note?: string;
}

export interface CreateQuotationResponse {
  id: string;
  total: number;
}

export interface QuotationShareResponse {
  publicUrl: string;
}
