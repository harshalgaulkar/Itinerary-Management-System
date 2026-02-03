import apiClient from './api';

/**
 * USER APIs
 * Handles user authentication, profile management, and user-related operations
 */
export const userAPI = {
  // Authentication endpoints
  signin: async (email, password) => {
    try {
      return await apiClient.post('/users/signin', { email, password });
    } catch (err) {
      console.warn('⚠ /users/signin failed, trying /auth/signin...');
      try {
        return await apiClient.post('/auth/signin', { email, password });
      } catch (err2) {
        throw err;
      }
    }
  },
  
  signup: async (userData) => {
    try {
      return await apiClient.post('/users/signup', userData);
    } catch (err) {
      console.warn('⚠ /users/signup failed, trying /auth/signup...');
      try {
        return await apiClient.post('/auth/signup', userData);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Profile management
  getProfile: async (userId) => {
    try {
      return await apiClient.get(`/users/profile/${userId}`);
    } catch (err) {
      console.warn('⚠ /users/profile/{id} failed, trying /users/{id}...');
      try {
        return await apiClient.get(`/users/${userId}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  updateProfile: async (userId, userData) => {
    try {
      return await apiClient.put(`/users/update/${userId}`, userData);
    } catch (err) {
      console.warn('⚠ /users/update/{id} failed, trying /users/{id}...');
      try {
        return await apiClient.put(`/users/${userId}`, userData);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  deleteAccount: async (userId) => {
    try {
      return await apiClient.delete(`/users/delete/${userId}`);
    } catch (err) {
      console.warn('⚠ /users/delete/{id} failed, trying /users/{id}...');
      try {
        return await apiClient.delete(`/users/${userId}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // User bookings and information
  getUserBookings: async (userId) => {
    try {
      return await apiClient.get(`/users/bookings/${userId}`);
    } catch (err) {
      console.warn('⚠ /users/bookings/{id} failed, trying /bookings...');
      try {
        return await apiClient.get(`/bookings?user_id=${userId}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  getAllUsers: async () => {
    try {
      return await apiClient.get('/users');
    } catch (err) {
      console.warn('⚠ /users failed, trying /admin/users...');
      try {
        return await apiClient.get('/admin/users');
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Additional user endpoints
  getUserById: async (userId) => {
    try {
      return await apiClient.get(`/users/${userId}`);
    } catch (err) {
      console.warn('⚠ /users/{id} failed, trying /users/profile/{id}...');
      try {
        return await apiClient.get(`/users/profile/${userId}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  updatePassword: async (userId, oldPassword, newPassword) => {
    try {
      return await apiClient.put(`/users/${userId}/password`, { oldPassword, newPassword });
    } catch (err) {
      console.warn('⚠ /users/{id}/password failed, trying /users/change-password...');
      try {
        return await apiClient.put('/users/change-password', { userId, oldPassword, newPassword });
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      return await apiClient.get('/users/me');
    } catch (err) {
      console.warn('⚠ /users/me failed, trying /users/current...');
      try {
        return await apiClient.get('/users/current');
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Update user role
  updateRole: async (userId, roleData) => {
    try {
      return await apiClient.put(`/users/${userId}/role`, roleData);
    } catch (err) {
      console.warn('⚠ /users/{id}/role failed, trying /admin/user/{id}/role...');
      try {
        return await apiClient.put(`/admin/user/${userId}/role`, roleData);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Delete user (admin)
  deleteUser: async (userId) => {
    try {
      return await apiClient.delete(`/users/${userId}`);
    } catch (err) {
      console.warn('⚠ /users/{id} delete failed, trying /admin/user/{id}...');
      try {
        return await apiClient.delete(`/admin/user/${userId}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Create user (admin)
  createUser: async (userData) => {
    try {
      return await apiClient.post('/admin/signup/user', userData);
    } catch (err) {
      console.warn('⚠ /admin/signup/user failed, trying /users/admin...');
      try {
        return await apiClient.post('/users/admin', userData);
      } catch (err2) {
        throw err;
      }
    }
  },
};

/**
 * DESTINATION APIs
 * Handles destination data, packages at destinations, and destination management
 */
export const destinationAPI = {
  // Get all destinations with pagination and filtering
  getAll: (page = 1, limit = 10, filters = {}) => 
    apiClient.get('/destinations', { params: { page, limit, ...filters } }),
  
  // Get single destination
  getById: (id) => 
    apiClient.get(`/destinations/${id}`),
  
  // Get all packages for a specific destination
  getPackages: (id) => 
    apiClient.get(`/destinations/${id}/packages`),
  
  // Create new destination (admin only)
  create: (data) => 
    apiClient.post('/destinations', data),
  
  // Update destination (admin only)
  update: (id, data) => 
    apiClient.put(`/destinations/${id}`, data),
  
  // Delete destination (admin only)
  delete: (id) => 
    apiClient.delete(`/destinations/${id}`),
  
  // Search destinations
  search: (searchTerm) => 
    apiClient.get('/destinations/search', { params: { q: searchTerm } }),
};

/**
 * PACKAGE APIs
 * Handles travel package information, itineraries, and dates
 */
export const packageAPI = {
  // Get all packages with pagination and filtering
  getAll: async (page = 1, limit = 10, filters = {}) => {
    try {
      return await apiClient.get('/packages', { params: { page, limit, ...filters } });
    } catch (err) {
      console.warn('⚠ /packages endpoint failed, trying /api/packages...');
      try {
        return await apiClient.get('/api/packages', { params: { page, limit, ...filters } });
      } catch (err2) {
        console.warn('⚠ /api/packages failed, trying /packageMaster...');
        try {
          return await apiClient.get('/packageMaster', { params: { page, limit, ...filters } });
        } catch (err3) {
          console.error('✗ All package endpoints failed');
          throw err;
        }
      }
    }
  },
  
  // Get single package
  getById: async (id) => {
    try {
      return await apiClient.get(`/packages/${id}`);
    } catch (err) {
      console.warn('⚠ /packages/{id} failed, trying /packageMaster/{id}...');
      try {
        return await apiClient.get(`/packageMaster/${id}`);
      } catch (err2) {
        throw err;
      }
    }
  },
  
  // Get available dates for a package
  getDates: async (id) => {
    console.log('🔍 packageAPI.getDates called with ID:', id);
    try {
      console.log('🔍 Trying /packages/' + id + '/dates');
      const response = await apiClient.get(`/packages/${id}/dates`);
      console.log('✓ Success! /packages/' + id + '/dates returned:', response.data);
      
      // Wrap response to ensure consistent structure for frontend
      // Backend returns: { status: 'success', data: [...] }
      // We need to return: { data: { data: [...] } } for consistency with frontend expectations
      if (response.data && !Array.isArray(response.data)) {
        // Backend wrapped it, so wrap it again for consistency
        return { data: response.data };
      } else {
        // Backend returned raw array or already has the right structure
        return response;
      }
    } catch (err) {
      console.warn('⚠ /packages/{id}/dates failed with status:', err.response?.status);
      console.warn('⚠ Error:', err.message);
      console.warn('⚠ Trying fallback: /packageMaster/{id}/dates');
      try {
        const response = await apiClient.get(`/packageMaster/${id}/dates`);
        console.log('✓ Success! /packageMaster/' + id + '/dates returned:', response.data);
        // Same wrapping logic
        if (response.data && !Array.isArray(response.data)) {
          return { data: response.data };
        } else {
          return response;
        }
      } catch (err2) {
        console.warn('⚠ /packageMaster/{id}/dates also failed with status:', err2.response?.status);
        console.warn('⚠ Returning empty dates array');
        return { data: { data: [] } };
      }
    }
  },
  
  // Get itinerary for a package
  getItineraries: async (id) => {
    try {
      return await apiClient.get(`/packages/${id}/itineraries`);
    } catch (err) {
      console.warn('⚠ /packages/{id}/itineraries failed, trying /packageMaster/{id}/itineraries...');
      try {
        return await apiClient.get(`/packageMaster/${id}/itineraries`);
      } catch (err2) {
        return { data: { data: [] } };
      }
    }
  },
  
  // Get reviews for a package
  getReviews: async (id) => {
    try {
      return await apiClient.get(`/packages/${id}/reviews`);
    } catch (err) {
      console.warn('⚠ /packages/{id}/reviews failed, trying /reviews...');
      try {
        return await apiClient.get(`/reviews?package_id=${id}`);
      } catch (err2) {
        return { data: { data: [] } };
      }
    }
  },
  
  // Create new package (admin only)
  create: (data) => 
    apiClient.post('/packages', data),
  
  // Update package (admin only)
  update: (id, data) => 
    apiClient.put(`/packages/${id}`, data),
  
  // Delete package (admin only)
  delete: (id) => 
    apiClient.delete(`/packages/${id}`),
  
  // Search packages
  search: (searchTerm) => 
    apiClient.get('/packages/search', { params: { q: searchTerm } }),
  
  // Get featured packages
  getFeatured: () => 
    apiClient.get('/packages/featured'),

  // Add date to package
  addDate: (packageId, data) =>
    apiClient.post(`/packages/${packageId}/dates`, data),

  // Update package date
  updateDate: (packageId, dateId, data) =>
    apiClient.put(`/packages/${packageId}/dates/${dateId}`, data),

  // Delete package date
  deleteDate: (packageId, dateId) =>
    apiClient.delete(`/packages/${packageId}/dates/${dateId}`),
};

/**
 * PACKAGE MASTER APIs
 * Handles master package data, date management, and itinerary management
 */
export const packageMasterAPI = {
  // Get all master packages
  getAll: (page = 1, limit = 10) => 
    apiClient.get('/packageMaster', { params: { page, limit } }),
  
  // Get single master package
  getById: (id) => 
    apiClient.get(`/packageMaster/${id}`),
  
  // Get itineraries for master package
  getItineraries: (id) => 
    apiClient.get(`/packageMaster/${id}/itineraries`),
  
  // Get dates for master package
  getDates: async (id) => {
    try {
      return await apiClient.get(`/packageMaster/${id}/dates`);
    } catch (err) {
      console.warn('⚠ /packageMaster/{id}/dates failed, returning empty array...');
      return { data: { data: [] } };
    }
  },
  
  // Add date to master package
  addDate: (packageId, data) => 
    apiClient.post(`/packageMaster/${packageId}/dates`, data),
  
  // Update date in master package
  updateDate: (packageId, dateId, data) => 
    apiClient.put(`/packageMaster/${packageId}/dates/${dateId}`, data),
  
  // Delete date from master package
  deleteDate: (packageId, dateId) => 
    apiClient.delete(`/packageMaster/${packageId}/dates/${dateId}`),
  
  // Add itinerary to master package
  addItinerary: (packageId, data) => 
    apiClient.post(`/packageMaster/${packageId}/itineraries`, data),
  
  // Update itinerary in master package
  updateItinerary: (packageId, itineraryId, data) => 
    apiClient.put(`/packageMaster/${packageId}/itineraries/${itineraryId}`, data),
  
  // Delete itinerary from master package
  deleteItinerary: (packageId, itineraryId) => 
    apiClient.delete(`/packageMaster/${packageId}/itineraries/${itineraryId}`),
};

/**
 * BOOKING APIs
 * Handles booking creation, management, and status updates
 */
export const bookingAPI = {
  // Get all bookings (admin)
  getAll: (filters = {}) => 
    apiClient.get('/bookings', { params: filters }),

  
  // Get single booking
  getById: (id) => 
    apiClient.get(`/bookings/${id}`),
  
  // Get all bookings for a user
  getByUser: (userId) => 
    apiClient.get(`/bookings/user/${userId}`),
  
  // Create new booking
  create: (data) => 
    apiClient.post('/bookings', data),
  
  // Update booking details
  update: (id, data) => 
    apiClient.put(`/bookings/${id}`, data),
  
  // Confirm booking
  confirm: (id) => 
    apiClient.put(`/bookings/${id}/confirm`),
  
  // Cancel booking
  cancel: (id, reason = '') => 
    apiClient.put(`/bookings/${id}/cancel`, { reason }),
  
  // Mark booking as complete
  complete: (id) => 
    apiClient.put(`/bookings/${id}/complete`),
  
  // Delete booking (admin only)
  delete: (id) => 
    apiClient.delete(`/bookings/${id}`),
  
  // Get booking summary/statistics
  getSummary: (userId) => 
    apiClient.get(`/bookings/user/${userId}/summary`),
};

/**
 * PAYMENT APIs
 * Handles payment processing, history, and confirmations
 */
export const paymentAPI = {
  // Get all payments (admin)
  getAll: (filters = {}) => 
    apiClient.get('/payments', { params: filters }),
  
  // Get single payment
  getById: (id) => 
    apiClient.get(`/payments/${id}`),
  
  // Get all payments for a booking
  getByBooking: (bookingId) => 
    apiClient.get(`/payments/booking/${bookingId}`),
  
  // Get payment summary for a booking
  getSummary: (bookingId) => 
    apiClient.get(`/payments/booking/${bookingId}/summary`),
  
  // Create payment record
  create: (data) => 
    apiClient.post('/payments', data),
  
  // Update payment
  update: (id, data) => 
    apiClient.put(`/payments/${id}`, data),
  
  // Confirm payment
  confirm: (id) => 
    apiClient.put(`/payments/${id}/confirm`),
  
  // Reject payment
  reject: (id, reason = '') => 
    apiClient.put(`/payments/${id}/reject`, { reason }),
  
  // Delete payment (admin only)
  delete: (id) => 
    apiClient.delete(`/payments/${id}`),
  
  // Process refund
  refund: (paymentId, amount = null) => 
    apiClient.post(`/payments/${paymentId}/refund`, { amount }),
};

/**
 * REVIEW APIs
 * Handles package reviews and ratings
 */
export const reviewAPI = {
  // Get all reviews (admin)
  getAll: (filters = {}) => 
    apiClient.get('/reviews', { params: filters }),
  
  // Get single review
  getById: (id) => 
    apiClient.get(`/reviews/${id}`),
  
  // Get all reviews for a package
  getByPackage: (packageId) => 
    apiClient.get(`/reviews/package/${packageId}`),
  
  // Get all reviews by a user
  getByUser: (userId) => 
    apiClient.get(`/reviews/user/${userId}`),
  
  // Create new review
  create: (data) => 
    apiClient.post('/reviews', data),
  
  // Update review
  update: (id, data) => 
    apiClient.put(`/reviews/${id}`, data),
  
  // Delete review
  delete: (id) => 
    apiClient.delete(`/reviews/${id}`),
  
  // Get package rating summary
  getRatingSummary: (packageId) => 
    apiClient.get(`/reviews/package/${packageId}/summary`),
};

/**
 * ADMIN APIs
 * Handles admin operations like user management and dashboard data
 */
export const adminAPI = {
  // User management
  createUser: async (userData) => {
    try {
      return await apiClient.post('/admin/signup/user', userData);
    } catch (err) {
      console.warn('⚠ /admin/signup/user failed, trying /admin/users/create...');
      try {
        return await apiClient.post('/admin/users/create', userData);
      } catch (err2) {
        console.warn('⚠ /admin/users/create failed, trying /users/create...');
        try {
          return await apiClient.post('/users/create', userData);
        } catch (err3) {
          throw err;
        }
      }
    }
  },
  
  // Get all users - with fallback endpoints
  getAllUsers: async () => {
    try {
      // Try primary endpoint first
      return await apiClient.get('/admin/users');
    } catch (err) {
      console.warn('⚠ /admin/users failed, trying /users fallback...');
      try {
        // Fallback to /users endpoint
        return await apiClient.get('/users');
      } catch (err2) {
        console.error('✗ Both endpoints failed');
        throw err;
      }
    }
  },
  
  getUserById: (userId) => 
    apiClient.get(`/admin/users/${userId}`),
  
  updateUser: (userId, userData) => 
    apiClient.put(`/admin/users/${userId}`, userData),
  
  updateUserRole: (userId, roleData) => 
    apiClient.put(`/admin/user/${userId}/role`, roleData),
  
  deleteUser: (userId) => 
    apiClient.delete(`/admin/user/${userId}`),
  
  // Dashboard statistics
  getDashboardStats: () => 
    apiClient.get('/admin/dashboard/stats'),
  
  getRevenueStats: (filters = {}) => 
    apiClient.get('/admin/dashboard/revenue', { params: filters }),
  
  getBookingStats: (filters = {}) => 
    apiClient.get('/admin/dashboard/bookings', { params: filters }),
  
  getUserStats: () => 
    apiClient.get('/admin/dashboard/users'),
  
  // Destination management
  createDestination: (data) => 
    apiClient.post('/destinations', data),
  
  getAllDestinations: (page = 1, limit = 10) =>
    apiClient.get('/destinations', { params: { page, limit } }),
  
  updateDestination: (id, data) => 
    apiClient.put(`/destinations/${id}`, data),
  
  deleteDestination: (id) => 
    apiClient.delete(`/destinations/${id}`),
  
  // Package management
  createPackage: (data) => 
    apiClient.post('/packages', data),
  
  getAllPackages: (page = 1, limit = 10) =>
    apiClient.get('/packages', { params: { page, limit } }),
  
  updatePackage: (id, data) => 
    apiClient.put(`/packages/${id}`, data),
  
  deletePackage: (id) => 
    apiClient.delete(`/packages/${id}`),

  // Package dates management
  addPackageDate: async (data) => {
    try {
      // Backend expects: POST /packageMaster/{id}/dates with { start_date, end_date, seats_total }
      console.log('📝 addPackageDate sending to /packageMaster/', data.package_id, '/dates');
      return await apiClient.post(`/packageMaster/${data.package_id}/dates`, {
        start_date: data.start_date,
        end_date: data.end_date,
        seats_total: data.seats_total
      });
    } catch (err) {
      console.warn('⚠ /packageMaster/{id}/dates failed, trying /packages/{id}/dates...');
      try {
        return await apiClient.post(`/packages/${data.package_id}/dates`, {
          start_date: data.start_date,
          end_date: data.end_date,
          seats_total: data.seats_total
        });
      } catch (err2) {
        console.warn('⚠ /packages/{id}/dates failed');
        throw err;
      }
    }
  },

  deletePackageDate: async (dateId) => {
    try {
      return await apiClient.delete(`/package-dates/${dateId}`);
    } catch (err) {
      console.warn('⚠ /package-dates failed, trying /packages/dates...');
      try {
        return await apiClient.delete(`/packages/dates/${dateId}`);
      } catch (err2) {
        console.warn('⚠ /packages/dates failed, trying /admin/package-dates...');
        return await apiClient.delete(`/admin/package-dates/${dateId}`);
      }
    }
  },
  
  // Booking management
  getAllBookings: (filters = {}) =>
    apiClient.get('/admin/bookings', { params: filters }),
  
  getBookingDetails: (id) =>
    apiClient.get(`/admin/bookings/${id}`),
  
  updateBookingStatus: (id, status) =>
    apiClient.put(`/admin/bookings/${id}/status`, { status }),
};
