/**
 * Response Parser Utility
 * Automatically handles all backend response formats
 */

/**
 * Extract array data from any response format
 * @param {object} response - Axios response object
 * @returns {array} - Extracted data array
 */
export const extractArray = (response) => {
  if (!response || !response.data) return [];
  
  const data = response.data;
  
  // Direct array
  if (Array.isArray(data)) return data;
  
  // Common nested formats
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.results)) return data.results;
  
  return [];
};

/**
 * Extract single object from response
 * @param {object} response - Axios response object
 * @returns {object} - Extracted object
 */
export const extractObject = (response) => {
  if (!response || !response.data) return null;
  
  const data = response.data;
  
  // Direct object
  if (typeof data === 'object' && !Array.isArray(data) && data.user_id) {
    return data;
  }
  
  // Nested in data property
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return data.data;
  }
  
  return data;
};

/**
 * Extract error message from response
 * @param {error} error - Axios error object
 * @returns {string} - Error message
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  // Network error
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  
  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Server is not responding.';
  }
  
  const data = error.response?.data;
  
  // Try different error message keys
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.errors?.[0]) return data.errors[0];
  if (data?.msg) return data.msg;
  
  return error.message || 'An error occurred';
};

/**
 * Check if response indicates success
 * @param {object} response - Axios response object
 * @returns {boolean}
 */
export const isSuccessResponse = (response) => {
  if (!response) return false;
  
  const data = response.data;
  
  // HTTP status 2xx
  if (response.status >= 200 && response.status < 300) {
    // Check for explicit failure indicators
    if (data?.success === false) return false;
    if (data?.status === 'error') return false;
    return true;
  }
  
  return false;
};

/**
 * Parse paginated response
 * @param {object} response - Axios response object
 * @returns {object} - { data: [], page, limit, total, pages }
 */
export const extractPaginatedData = (response) => {
  const defaultResult = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  };
  
  if (!response || !response.data) return defaultResult;
  
  const data = response.data;
  
  return {
    data: extractArray(response),
    page: data.page || data.currentPage || 1,
    limit: data.limit || data.pageSize || 10,
    total: data.total || data.totalRecords || extractArray(response).length,
    pages: data.pages || data.totalPages || 1,
  };
};

/**
 * Unified response handler
 * Handles success and error consistently
 */
export class APIResponse {
  constructor(response = null, error = null) {
    this.response = response;
    this.error = error;
  }

  get success() {
    return !this.error && isSuccessResponse(this.response);
  }

  get data() {
    return this.success ? extractArray(this.response) : [];
  }

  get object() {
    return this.success ? extractObject(this.response) : null;
  }

  get message() {
    return this.error ? extractErrorMessage(this.error) : 'Success';
  }

  get status() {
    return this.response?.status || this.error?.response?.status || 0;
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      message: this.message,
      status: this.status,
    };
  }
}

/**
 * Hook-friendly response wrapper
 * Use in components like: const { data, loading, error } = useFetch(...)
 */
export const createAPIResult = (response, error, loading = false) => {
  const apiResponse = new APIResponse(response, error);
  
  return {
    success: apiResponse.success,
    data: apiResponse.data,
    object: apiResponse.object,
    error: apiResponse.message,
    loading,
    status: apiResponse.status,
    raw: response,
  };
};

export default {
  extractArray,
  extractObject,
  extractErrorMessage,
  isSuccessResponse,
  extractPaginatedData,
  APIResponse,
  createAPIResult,
};
