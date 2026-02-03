import { useState, useCallback, useEffect } from 'react';
import { handleApiError } from '../services/api';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute }
 */
export const useAPI = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorObj = handleApiError(err);
      setError(errorObj);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

/**
 * Custom hook for automatically fetching data on mount
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      setData(response.data);
    } catch (err) {
      const errorObj = handleApiError(err);
      setError(errorObj);
      console.error('Fetch error:', errorObj);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

/**
 * Custom hook for mutations (POST, PUT, DELETE operations)
 * @param {Function} apiFunction - The API mutation function
 * @returns {Object} - { mutate, data, loading, error }
 */
export const useMutation = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorObj = handleApiError(err);
      setError(errorObj);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, data, loading, error, reset };
};
