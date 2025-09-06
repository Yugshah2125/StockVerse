// Centralized error handling utilities

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static safeJsonParse<T>(jsonString: string | null, fallback: T): T {
    if (!jsonString) return fallback;
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return fallback;
    }
  }

  static safeLocalStorageGet<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return this.safeJsonParse(item, fallback);
    } catch (error) {
      console.warn(`Failed to access localStorage key "${key}":`, error);
      return fallback;
    }
  }

  static safeLocalStorageSet(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage key "${key}":`, error);
      return false;
    }
  }

  static async safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: T,
    errorMessage = 'API call failed'
  ): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.error(errorMessage, error);
      return fallback;
    }
  }

  static handleApiError(error: any): AppError {
    if (error?.response?.data?.message) {
      return {
        message: error.response.data.message,
        code: error.response.status?.toString(),
        details: error.response.data
      };
    }

    if (error?.message) {
      return {
        message: error.message,
        code: error.code,
        details: error
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }

  static clampValue(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
  }
}

// Hook for error boundary
export const useErrorHandler = () => {
  const handleError = (error: any, context = 'Unknown') => {
    const appError = ErrorHandler.handleApiError(error);
    console.error(`Error in ${context}:`, appError);
    
    // You could integrate with error reporting service here
    // e.g., Sentry, LogRocket, etc.
    
    return appError;
  };

  return { handleError };
};