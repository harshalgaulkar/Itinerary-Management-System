import axios from 'axios';

// API Base URL - Change this to your backend server IP
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor
 * Adds authentication token and user ID to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    // Add Authorization token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user ID header if available
    if (userId) {
      config.headers['user_id'] = userId;
    }

    // In development, log outgoing requests for debugging
    if (import.meta.env.DEV) {
      try {
        console.log('➡️ API Request:', config.method?.toUpperCase(), config.baseURL + config.url, 'Headers:', config.headers);
        if (config.data) {
          console.log('➡️ Payload:', JSON.parse(typeof config.data === 'string' ? config.data : JSON.stringify(config.data)));
        }
      } catch (logErr) {
        console.log('➡️ API Request (raw):', config);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles error responses and cleans up on authentication failure
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('API Response:', response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 Unauthorized - User needs to re-authenticate
      if (status === 401) {
        console.warn('Unauthorized access - clearing session');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      
      // 403 Forbidden - User doesn't have permission
      if (status === 403) {
        console.warn('Access forbidden');
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      
      // 500 Server Error
      if (status === 500) {
        console.error('Server error:', data);
      }
      
      // Log error details
      console.error(`API Error [${status}]:`, data?.error || data?.message || error.message);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Utility function to handle API errors consistently
 * @param {Error} error - The error object from axios
 * @returns {Object} - Formatted error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.error || error.response.data?.message || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      status: null,
      message: 'No response from server. Please check your connection.',
      data: null,
    };
  }
  return {
    status: null,
    message: error.message || 'An unexpected error occurred',
    data: null,
  };
};

export default apiClient;
