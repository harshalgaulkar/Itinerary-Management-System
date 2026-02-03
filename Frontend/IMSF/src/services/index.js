/**
 * Comprehensive API Service Module
 * Centralizes all API operations with consistent error handling
 * This module re-exports all endpoint functions for easy access
 */

export {
  userAPI,
  destinationAPI,
  packageAPI,
  packageMasterAPI,
  bookingAPI,
  paymentAPI,
  reviewAPI,
  adminAPI,
} from './endpoints';

export { handleApiError, default as apiClient } from './api';
export { apiIntegration, default as apiIntegrationService } from './apiIntegration';

/**
 * API Service Factory - Creates wrapped API calls with automatic error handling
 * Usage: const result = await apiService.users.getProfile(userId)
 */
import * as endpoints from './endpoints';
import { handleApiError } from './api';

const createApiService = () => {
  const wrapAPI = (apiObj) => {
    const wrapped = {};
    
    Object.keys(apiObj).forEach(key => {
      wrapped[key] = async (...args) => {
        try {
          const response = await apiObj[key](...args);
          return {
            success: true,
            data: response.data,
            status: response.status,
          };
        } catch (error) {
          const errorObj = handleApiError(error);
          return {
            success: false,
            error: errorObj,
            status: errorObj.status,
          };
        }
      };
    });
    
    return wrapped;
  };

  return {
    users: wrapAPI(endpoints.userAPI),
    destinations: wrapAPI(endpoints.destinationAPI),
    packages: wrapAPI(endpoints.packageAPI),
    packageMaster: wrapAPI(endpoints.packageMasterAPI),
    bookings: wrapAPI(endpoints.bookingAPI),
    payments: wrapAPI(endpoints.paymentAPI),
    reviews: wrapAPI(endpoints.reviewAPI),
    admin: wrapAPI(endpoints.adminAPI),
  };
};

export const apiService = createApiService();
