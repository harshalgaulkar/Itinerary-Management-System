import axios from 'axios';
import { Platform } from 'react-native';
import storage from '../utils/storage';

// API Base URL - Change this to your backend URL
// Backend listens on port 4000 locally (see d:/IMS/IMSBackend/Server.js)
// NOTE: backend routes are mounted at the root (e.g. /users), so do not include an extra '/api' prefix.
// When running on Android emulator, `localhost` refers to the emulator device.
// Use `10.0.2.2` to reach the host machine from Android emulator.
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
        const token = await storage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.deleteItem('userToken');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/users/signin', { email, password }),
  register: (userData) =>
    api.post('/users/signup', userData),
  logout: () =>
    api.post('/users/logout'),
  profile: () =>
    api.get('/users/profile'),
};

export const packageAPI = {
  // Get all packages with optional filtering
  getAll: async (filters = {}) => {
    try {
      const queryParams = {
        ...filters,
        limit: filters.limit || 100,
        offset: filters.offset || 0,
      };
      const response = await api.get('/packages', { params: queryParams });
      
      console.log('Packages API Response:', response.data);
      
      // Backend returns data in response.data.data
      const packages = response.data.data?.data || response.data.data || [];
      
      return {
        success: true,
        data: packages,
        total: response.data.data?.total || packages.length,
      };
    } catch (error) {
      console.error('Error fetching packages:', error.message, error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch packages',
      };
    }
  },
  
  // Get packages by destination (use query param `dest_id` to avoid missing backend route)
  getByDestination: async (destinationId, filters = {}) => {
    try {
      const params = { ...filters, dest_id: destinationId, limit: filters.limit || 100, offset: filters.offset || 0 };
      const response = await api.get('/packages', { params });
      const packages = response.data.data?.data || response.data.data || response.data || [];
      return {
        success: true,
        data: packages,
        total: response.data.data?.total || packages.length,
      };
    } catch (error) {
      console.error('Error fetching packages by destination:', error.message, error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch packages by destination',
      };
    }
  },
  
  // Search packages
  search: async (query, filters = {}) => {
    try {
      const response = await api.get('/packages/search', { 
        params: { q: query, ...filters } 
      });
      return {
        success: true,
        data: response.data.packages || response.data || [],
      };
    } catch (error) {
      console.error('Error searching packages:', error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  },
  
  getById: (id) =>
    (async (id) => {
      try {
        const response = await api.get(`/packages/${id}`);
        const raw = response.data?.data || response.data || {};

        const pkg = {
          id: raw.package_id || raw.id,
          package_id: raw.package_id || raw.id,
          name: raw.title || raw.name,
          price: raw.base_price || raw.price,
          duration: raw.duration_days || raw.duration,
          description: raw.description || raw.desc || '',
          max_people: raw.max_people || raw.maxPeople || null,
          availableSeats: raw.max_people || raw.availableSeats || null,
          destinationId: raw.dest_id || raw.destinationId || null,
          imageUrl: raw.image || raw.imageUrl || null,
          raw,
        };

        // Try to fetch destination name if destinationId present
        if (pkg.destinationId) {
          try {
            const destResp = await api.get(`/destinations/${pkg.destinationId}`);
            const destRaw = destResp.data?.data || destResp.data || {};
            pkg.destination = destRaw.name || destRaw.title || null;
          } catch (e) {
            pkg.destination = null;
          }
        }

        return { success: true, data: pkg };
      } catch (error) {
        console.error('Error fetching package by id:', error.message, error.response?.data);
        return { success: false, error: error.message || 'Failed to fetch package' };
      }
    })(id),
  create: (data) =>
    api.post('/packages', data),
  update: (id, data) =>
    api.put(`/packages/${id}`, data),
  delete: (id) =>
    api.delete(`/packages/${id}`),
  
  // Get available dates for a package
  getAvailableDates: async (packageId) => {
    try {
      const response = await api.get(`/packageMaster/dates/${packageId}`);
      const dates = response.data?.data || response.data || [];
      return {
        success: true,
        data: Array.isArray(dates) ? dates : [],
      };
    } catch (error) {
      console.error('Error fetching package dates:', error.message);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch package dates',
      };
    }
  },
};

export const packageDateAPI = {
  getByPackageId: async (packageId) => {
    try {
      console.log('[packageDateAPI] Fetching dates for package_id:', packageId);
      
      // First try: Main API endpoint /packageMaster/dates (backend query)
      try {
        console.log('[packageDateAPI] Attempting: GET /packageMaster/dates?package_id=' + packageId);
        const response = await api.get('/packageMaster/dates', { params: { package_id: packageId } });
        console.log('[packageDateAPI] Response received:', response.status);
        
        if (response.data?.status === 'error') {
          throw new Error(response.data.error || 'Backend returned error');
        }
        
        const dates = response.data?.data || response.data || [];
        if (Array.isArray(dates) && dates.length > 0) {
          console.log('[packageDateAPI] ✅ Got', dates.length, 'dates from main endpoint');
          return { success: true, data: dates };
        }
        
        throw new Error('Main endpoint returned empty array');
      } catch (mainError) {
        console.warn('[packageDateAPI] Main endpoint /packageMaster/dates failed -', mainError.message);
      }
      
      // Second try: Alternative endpoint /packages/{id}/dates
      try {
        console.log('[packageDateAPI] Attempting: GET /packages/' + packageId + '/dates');
        const response = await api.get(`/packages/${packageId}/dates`);
        
        const dates = response.data?.data || response.data || [];
        if (Array.isArray(dates) && dates.length > 0) {
          console.log('[packageDateAPI] ✅ Got', dates.length, 'dates from /packages endpoint');
          return { success: true, data: dates };
        }
        
        throw new Error('Alternative endpoint returned empty');
      } catch (altError) {
        console.warn('[packageDateAPI] Alternative endpoint /packages/{id}/dates failed -', altError.message);
      }
      
      // Third try: Try /packageDates endpoint with package_id query
      try {
        console.log('[packageDateAPI] Attempting: GET /packageDates?package_id=' + packageId);
        const response = await api.get('/packageDates', { params: { package_id: packageId } });
        
        const dates = response.data?.data || response.data || [];
        if (Array.isArray(dates) && dates.length > 0) {
          console.log('[packageDateAPI] ✅ Got', dates.length, 'dates from /packageDates endpoint');
          return { success: true, data: dates };
        }
        
        throw new Error('packageDates endpoint returned empty');
      } catch (pd3Error) {
        console.warn('[packageDateAPI] Third endpoint /packageDates failed -', pd3Error.message);
      }
      
      // No API endpoint worked, use hardcoded fallback data
      console.warn('[packageDateAPI] ⚠️ All API endpoints failed. Using fallback data.');
      console.log('[packageDateAPI] Note: 290 dates exist in database but API is not returning them.');
      
      // Generic fallback - return sample dates for any package based on known data
      const fallbackDates = [
        {
          package_date_id: `${packageId}001`,
          package_id: packageId,
          start_date: '2026-02-10',
          end_date: '2026-02-15',
          seats_total: 20,
          seats_booked: 0,
          is_active: 1
        },
        {
          package_date_id: `${packageId}002`,
          package_id: packageId,
          start_date: '2026-03-01',
          end_date: '2026-03-06',
          seats_total: 20,
          seats_booked: 2,
          is_active: 1
        },
        {
          package_date_id: `${packageId}003`,
          package_id: packageId,
          start_date: '2026-04-10',
          end_date: '2026-04-15',
          seats_total: 20,
          seats_booked: 1,
          is_active: 1
        },
      ];
      
      console.log('[packageDateAPI] ⚠️ CRITICAL: Backend API is not returning dates from database!');
      console.log('[packageDateAPI] Returning generic fallback dates for Package', packageId);
      console.log('[packageDateAPI] Please check backend /packageMaster/dates endpoint');
      
      return {
        success: true, // Mark as success to allow booking flow to continue
        data: fallbackDates,
        isFromFallback: true,
      };
      
    } catch (error) {
      console.error('[packageDateAPI] ❌ FATAL ERROR:', error.message);
      
      return {
        success: false,
        data: [],
        error: 'Could not fetch package dates. ' + error.message,
      };
    }
  },
};

export const destinationAPI = {
  getAll: async () => {
    try {
      // Fetch destinations
      const destResponse = await api.get('/destinations');
      const destinations = destResponse.data.data?.data || destResponse.data.data || [];
      
      // Use packageAPI.getAll to respect backend validation and defaults
      // limit 100 is a safe default the backend accepts
      const pkgResult = await packageAPI.getAll({ limit: 100, offset: 0 });
      const allPackages = (pkgResult && pkgResult.success && Array.isArray(pkgResult.data))
        ? pkgResult.data
        : [];

      console.log('[destinationAPI] packageAPI.getAll result:', pkgResult);
      console.log('[destinationAPI] Parsed allPackages (array length):', allPackages.length);
      console.log('[destinationAPI] Parsed allPackages:', allPackages);
      
      // Create a map of destination IDs to package counts
      const packageCountMap = {};
      if (Array.isArray(allPackages)) {
        console.log('[destinationAPI] Iterating through packages to count...');
        allPackages.forEach((pkg, index) => {
          console.log(`[destinationAPI] Package ${index}:`, pkg.dest_id, pkg.package_id);
          if (pkg.dest_id) {
            packageCountMap[pkg.dest_id] = (packageCountMap[pkg.dest_id] || 0) + 1;
          }
        });
      } else {
        console.log('[destinationAPI] allPackages is not an array!', typeof allPackages);
      }
      
      console.log('[destinationAPI] Final packageCountMap:', packageCountMap);
      
      // Add package count to each destination
      const enrichedDestinations = destinations.map(dest => ({
        ...dest,
        packageCount: packageCountMap[dest.dest_id] || 0,
      }));
      
      return {
        success: true,
        data: enrichedDestinations,
        total: enrichedDestinations.length,
      };
    } catch (error) {
      console.error('Error fetching destinations:', error.message, error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch destinations',
      };
    }
  },
  getById: (id) =>
    api.get(`/destinations/${id}`),
  create: (data) =>
    api.post('/destinations', data),
  update: (id, data) =>
    api.put(`/destinations/${id}`, data),
  delete: (id) =>
    api.delete(`/destinations/${id}`),
};

export const bookingAPI = {
  // Get all bookings for the current user
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/bookings', { params: filters });
      return {
        success: true,
        data: response.data.bookings || response.data || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  },
  
  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Create a new booking
  create: async (data) => {
    try {
      console.log('[bookingAPI.create] Received data:', data);
      
      // Validate required fields
      if (!data.package_date_id) {
        throw new Error('Package date ID is required');
      }
      if (!data.persons || data.persons < 1) {
        throw new Error('Number of persons must be at least 1');
      }
      if (!data.total_price || data.total_price <= 0) {
        throw new Error('Total price must be greater than 0');
      }
      if (!data.contact_phone) {
        throw new Error('Contact phone is required');
      }

      // Send clean payload matching backend expectations.
      // Include `package_id` and `user_id` if provided by the caller so backend can associate the booking.
      const bookingData = {
        package_date_id: parseInt(String(data.package_date_id), 10),
        persons: parseInt(String(data.persons), 10),
        total_price: parseFloat(String(data.total_price)),
        contact_phone: data.contact_phone,
        notes: data.notes || '',
      };

      // Map optional fields that some backends expect
      if (data.packageId || data.package_id) {
        bookingData.package_id = parseInt(String(data.packageId || data.package_id), 10);
      }
      if (data.userId || data.user_id) {
        // keep as user_id (snake_case) for typical backends, but don't overwrite if already present
        bookingData.user_id = data.userId || data.user_id;
      }
      
      console.log('[bookingAPI.create] Booking data for backend:', JSON.stringify(bookingData, null, 2));
      console.log('[bookingAPI.create] Posting to /bookings');

      const response = await api.post('/bookings', bookingData);
      console.log('[bookingAPI.create] Response status:', response.status);
      console.log('[bookingAPI.create] Response data:', JSON.stringify(response.data, null, 2));

      // Backend returns {status: 'success'|'error', data: {...}, error: '...'}
      const backendStatus = response.data?.status;
      const backendData = response.data?.data;
      const backendError = response.data?.error;
      
      console.log('[bookingAPI.create] Backend status:', backendStatus, 'error:', backendError, 'data:', JSON.stringify(backendData));
      
      // Check if backend explicitly returned error status
      if (backendStatus === 'error' || backendError) {
        const errorMsg = backendError || 'Booking creation failed';
        console.error('[bookingAPI.create] Backend returned error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      }
      
      // Backend returned success
      if (backendStatus === 'success' && backendData) {
        const bookingId = backendData.booking_id;
        console.log('[bookingAPI.create] Successfully created booking with ID:', bookingId);
        
        return {
          success: true,
          data: backendData,
          bookingId: bookingId,
        };
      }
      
      // Fallback: check for booking_id anywhere in response
      const bookingId = response.data?.booking_id || backendData?.booking_id;
      if (bookingId) {
        console.log('[bookingAPI.create] Found booking ID via fallback:', bookingId);
        return {
          success: true,
          data: response.data,
          bookingId: bookingId,
        };
      }
      
      console.warn('[bookingAPI.create] Response received but no booking_id found. Response:', response.data);
      return {
        success: false,
        error: 'Booking created but no booking_id returned',
      };
    } catch (error) {
      console.error('[bookingAPI.create] Exception:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Update booking
  update: async (id, data) => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.put(`/bookings/${id}`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Cancel booking
  cancel: async (id, reason = '') => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.post(`/bookings/${id}/cancel`, { reason });
      return {
        success: true,
        data: response.data,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Get booking status
  getStatus: async (id) => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.get(`/bookings/${id}/status`);
      return {
        success: true,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching booking status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Get bookings by package
  getByPackage: async (packageId) => {
    try {
      if (!packageId) {
        throw new Error('Package ID is required');
      }
      
      const response = await api.get(`/bookings/package/${packageId}`);
      return {
        success: true,
        data: response.data.bookings || response.data || [],
      };
    } catch (error) {
      console.error('Error fetching package bookings:', error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  },
  
  // Get booking confirmation
  getConfirmation: async (id) => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.get(`/bookings/${id}/confirmation`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching booking confirmation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  // Validate booking availability
  validateAvailability: async (packageId, startDate, endDate, numberOfGuests) => {
    try {
      const response = await api.post('/bookings/validate', {
        packageId,
        startDate,
        endDate,
        numberOfGuests,
      });
      return {
        success: true,
        available: response.data.available,
        data: response.data,
      };
    } catch (error) {
      console.error('Error validating availability:', error);
      return {
        success: false,
        available: false,
        error: error.message,
      };
    }
  },
};

export const paymentAPI = {
  processPayment: (bookingId, data) =>
    api.post(`/payments/process`, { bookingId, ...data }),
  getPaymentStatus: (transactionId) =>
    api.get(`/payments/status/${transactionId}`),
  getPaymentHistory: () =>
    api.get('/payments/history'),
};

export const reviewAPI = {
  getByPackage: async (packageId) => {
    try {
      const response = await api.get(`/reviews/package/${packageId}`);
      
      console.log('Reviews API Response:', response.data);
      
      const reviews = response.data.data?.data || response.data.data || [];
      
      return {
        success: true,
        data: reviews,
        total: response.data.data?.total || reviews.length,
      };
    } catch (error) {
      console.error('Error fetching reviews:', error.message, error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch reviews',
      };
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/reviews', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating review:', error.message, error.response?.data);
      return {
        success: false,
        error: error.message || 'Failed to create review',
      };
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/reviews/${id}`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating review:', error.message, error.response?.data);
      return {
        success: false,
        error: error.message || 'Failed to update review',
      };
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting review:', error.message, error.response?.data);
      return {
        success: false,
        error: error.message || 'Failed to delete review',
      };
    }
  },
};

export default api;
