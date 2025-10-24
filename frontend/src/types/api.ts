export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  results: T;
  errors: string[];
}

export interface ApiResponseWrapper<T = any> {
  default: ApiResponse<T>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}