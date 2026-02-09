import { useState, useCallback } from 'react';
import api from '../services/api';

export const useAPI = (initialState = null) => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiCall;
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearData = useCallback(() => setData(initialState), [initialState]);

  return {
    data,
    isLoading,
    error,
    request,
    clearError,
    clearData,
    setData,
  };
};
