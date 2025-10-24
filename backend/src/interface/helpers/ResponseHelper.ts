export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  results: T;
  errors: string[];
}

export class ResponseHelper {
  static success<T>(data: T, message: string = 'success'): ApiResponse<T> {
    return {
      status: true,
      message,
      results: data,
      errors: []
    };
  }

  static error(message: string, errors: string[] = []): ApiResponse<null> {
    return {
      status: false,
      message,
      results: null,
      errors: errors.length > 0 ? errors : [message]
    };
  }

  static created<T>(data: T, message: string = 'created'): ApiResponse<T> {
    return {
      status: true,
      message,
      results: data,
      errors: []
    };
  }

  static updated<T>(data: T, message: string = 'updated'): ApiResponse<T> {
    return {
      status: true,
      message,
      results: data,
      errors: []
    };
  }

  static deleted(message: string = 'deleted'): ApiResponse<{}> {
    return {
      status: true,
      message,
      results: {},
      errors: []
    };
  }
}