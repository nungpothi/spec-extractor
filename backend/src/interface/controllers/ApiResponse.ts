export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  results: T[];
  errors: string[];
}

export class ApiResponseBuilder {
  static success<T>(data: T | T[], message = 'success'): ApiResponse<T> {
    const results = Array.isArray(data) ? data : [data];
    return {
      status: true,
      message,
      results,
      errors: [],
    };
  }

  static error(message: string, errors: string[] = []): ApiResponse {
    return {
      status: false,
      message,
      results: [],
      errors: [message, ...errors],
    };
  }

  static created<T>(data: T, message = 'created'): ApiResponse<T> {
    return this.success(data, message);
  }

  static deleted(message = 'deleted'): ApiResponse {
    return {
      status: true,
      message,
      results: [],
      errors: [],
    };
  }
}