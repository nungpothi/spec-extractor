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