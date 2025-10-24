export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: string;
  status: string;
  notes?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  status?: string;
  notes?: string;
}

export interface TemplateListItem {
  id: string;
  name: string;
  category: string;
  status: string;
  updated_at: string;
}