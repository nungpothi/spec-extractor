import { useState, useCallback } from 'react';

export const useJsonValidator = () => {
  const [jsonError, setJsonError] = useState<string>('');

  const validateJson = useCallback((jsonString: string): object | null => {
    setJsonError('');
    
    if (!jsonString.trim()) {
      return null;
    }

    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setJsonError(errorMessage);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setJsonError('');
  }, []);

  return {
    jsonError,
    validateJson,
    clearError,
  };
};