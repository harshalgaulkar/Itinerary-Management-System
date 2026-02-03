/**
 * API Integration Service
 * Comprehensive service that calls all backend APIs
 * Used for testing, admin operations, and complete project integration
 */

import {
  userAPI,
  destinationAPI,
  packageAPI,
  packageMasterAPI,
  bookingAPI,
  paymentAPI,
  reviewAPI,
  adminAPI,
} from './endpoints';

export const apiIntegration = {
  /**
   * USER OPERATIONS
   */
  users: {
    authenticate: async (email, password) => {
      console.log('🔐 Authenticating user:', email);
      try {
        const response = await userAPI.signin(email, password);
        console.log('✓ Authentication successful');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Authentication failed:', error.message);
        return { success: false, error: error.message };
      }
    },

    register: async (userData) => {
      console.log('📝 Registering new user:', userData.email);
      try {
        const response = await userAPI.signup(userData);
        console.log('✓ Registration successful');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Registration failed:', error.message);
        return { success: false, error: error.message };
      }
    },

    getProfile: async (userId) => {
      console.log('👤 Fetching user profile:', userId);
      try {
        const response = await userAPI.getProfile(userId);
        console.log('✓ Profile fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch profile:', error.message);
        return { success: false, error: error.message };
      }
    },

    updateProfile: async (userId, userData) => {
      console.log('✏️ Updating user profile:', userId);
      try {
        const response = await userAPI.updateProfile(userId, userData);
        console.log('✓ Profile updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update profile:', error.message);
        return { success: false, error: error.message };
      }
    },

    updatePassword: async (userId, oldPassword, newPassword) => {
      console.log('🔑 Updating password for user:', userId);
      try {
        const response = await userAPI.updatePassword(userId, oldPassword, newPassword);
        console.log('✓ Password updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update password:', error.message);
        return { success: false, error: error.message };
      }
    },

    getUserBookings: async (userId) => {
      console.log('📚 Fetching user bookings:', userId);
      try {
        const response = await userAPI.getUserBookings(userId);
        console.log('✓ Bookings fetched:', response.data.length || 0);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch bookings:', error.message);
        return { success: false, error: error.message };
      }
    },

    deleteAccount: async (userId) => {
      console.log('🗑️ Deleting user account:', userId);
      try {
        const response = await userAPI.deleteAccount(userId);
        console.log('✓ Account deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete account:', error.message);
        return { success: false, error: error.message };
      }
    },

    getAllUsers: async () => {
      console.log('👥 Fetching all users');
      try {
        const response = await userAPI.getAllUsers();
        const users = response.data?.data || response.data || [];
        console.log('✓ Users fetched:', Array.isArray(users) ? users.length : 0);
        return { success: true, data: users };
      } catch (error) {
        console.error('✗ Failed to fetch users:', error.message);
        return { success: false, error: error.message };
      }
    },

    getUserById: async (userId) => {
      console.log('👤 Fetching user by ID:', userId);
      try {
        const response = await userAPI.getUserById(userId);
        console.log('✓ User fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch user:', error.message);
        return { success: false, error: error.message };
      }
    },

    getCurrentUser: async () => {
      console.log('👤 Fetching current user');
      try {
        const response = await userAPI.getCurrentUser();
        console.log('✓ Current user fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch current user:', error.message);
        return { success: false, error: error.message };
      }
    },

    updateRole: async (userId, roleData) => {
      console.log('🔐 Updating user role:', userId);
      try {
        const response = await userAPI.updateRole(userId, roleData);
        console.log('✓ Role updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update role:', error.message);
        return { success: false, error: error.message };
      }
    },

    deleteUser: async (userId) => {
      console.log('🗑️ Deleting user:', userId);
      try {
        const response = await userAPI.deleteUser(userId);
        console.log('✓ User deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete user:', error.message);
        return { success: false, error: error.message };
      }
    },

    createUser: async (userData) => {
      console.log('➕ Creating new user:', userData.email);
      try {
        const response = await userAPI.createUser(userData);
        console.log('✓ User created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create user:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * DESTINATION OPERATIONS
   */
  destinations: {
    getAll: async (page = 1, limit = 10, filters = {}) => {
      console.log('🏝️ Fetching destinations:', { page, limit });
      try {
        const response = await destinationAPI.getAll(page, limit, filters);
        const destinations = response.data?.data || response.data || [];
        console.log('✓ Destinations fetched:', Array.isArray(destinations) ? destinations.length : 0);
        return { success: true, data: destinations };
      } catch (error) {
        console.error('✗ Failed to fetch destinations:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('🏝️ Fetching destination:', id);
      try {
        const response = await destinationAPI.getById(id);
        console.log('✓ Destination fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch destination:', error.message);
        return { success: false, error: error.message };
      }
    },

    getPackages: async (id) => {
      console.log('📦 Fetching packages for destination:', id);
      try {
        const response = await destinationAPI.getPackages(id);
        const packages = response.data?.data || response.data || [];
        console.log('✓ Packages fetched:', Array.isArray(packages) ? packages.length : 0);
        return { success: true, data: packages };
      } catch (error) {
        console.error('✗ Failed to fetch packages:', error.message);
        return { success: false, error: error.message };
      }
    },

    create: async (data) => {
      console.log('➕ Creating destination:', data.name);
      try {
        const response = await destinationAPI.create(data);
        console.log('✓ Destination created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create destination:', error.message);
        return { success: false, error: error.message };
      }
    },

    update: async (id, data) => {
      console.log('✏️ Updating destination:', id);
      try {
        const response = await destinationAPI.update(id, data);
        console.log('✓ Destination updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update destination:', error.message);
        return { success: false, error: error.message };
      }
    },

    delete: async (id) => {
      console.log('🗑️ Deleting destination:', id);
      try {
        const response = await destinationAPI.delete(id);
        console.log('✓ Destination deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete destination:', error.message);
        return { success: false, error: error.message };
      }
    },

    search: async (term) => {
      console.log('🔍 Searching destinations:', term);
      try {
        const response = await destinationAPI.search(term);
        const results = response.data?.data || response.data || [];
        console.log('✓ Search results:', Array.isArray(results) ? results.length : 0);
        return { success: true, data: results };
      } catch (error) {
        console.error('✗ Search failed:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * PACKAGE OPERATIONS
   */
  packages: {
    getAll: async (page = 1, limit = 10, filters = {}) => {
      console.log('📦 Fetching packages:', { page, limit });
      try {
        const response = await packageAPI.getAll(page, limit, filters);
        const packages = response.data?.data || response.data || [];
        console.log('✓ Packages fetched:', Array.isArray(packages) ? packages.length : 0);
        return { success: true, data: packages };
      } catch (error) {
        console.error('✗ Failed to fetch packages:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('📦 Fetching package:', id);
      try {
        const response = await packageAPI.getById(id);
        console.log('✓ Package fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch package:', error.message);
        return { success: false, error: error.message };
      }
    },

    getDates: async (id) => {
      console.log('📅 Fetching package dates:', id);
      try {
        const response = await packageAPI.getDates(id);
        const dates = response.data?.data || response.data || [];
        console.log('✓ Package dates fetched:', Array.isArray(dates) ? dates.length : 0);
        return { success: true, data: dates };
      } catch (error) {
        console.error('✗ Failed to fetch dates:', error.message);
        return { success: false, error: error.message };
      }
    },

    getItineraries: async (id) => {
      console.log('📋 Fetching itineraries:', id);
      try {
        const response = await packageAPI.getItineraries(id);
        const itineraries = response.data?.data || response.data || [];
        console.log('✓ Itineraries fetched:', Array.isArray(itineraries) ? itineraries.length : 0);
        return { success: true, data: itineraries };
      } catch (error) {
        console.error('✗ Failed to fetch itineraries:', error.message);
        return { success: false, error: error.message };
      }
    },

    getReviews: async (id) => {
      console.log('⭐ Fetching package reviews:', id);
      try {
        const response = await packageAPI.getReviews(id);
        const reviews = response.data?.data || response.data || [];
        console.log('✓ Reviews fetched:', Array.isArray(reviews) ? reviews.length : 0);
        return { success: true, data: reviews };
      } catch (error) {
        console.error('✗ Failed to fetch reviews:', error.message);
        return { success: false, error: error.message };
      }
    },

    getFeatured: async () => {
      console.log('🌟 Fetching featured packages');
      try {
        const response = await packageAPI.getFeatured();
        const featured = response.data?.data || response.data || [];
        console.log('✓ Featured packages fetched:', Array.isArray(featured) ? featured.length : 0);
        return { success: true, data: featured };
      } catch (error) {
        console.error('✗ Failed to fetch featured packages:', error.message);
        return { success: false, error: error.message };
      }
    },

    search: async (term) => {
      console.log('🔍 Searching packages:', term);
      try {
        const response = await packageAPI.search(term);
        const results = response.data?.data || response.data || [];
        console.log('✓ Search results:', Array.isArray(results) ? results.length : 0);
        return { success: true, data: results };
      } catch (error) {
        console.error('✗ Search failed:', error.message);
        return { success: false, error: error.message };
      }
    },

    create: async (data) => {
      console.log('➕ Creating package:', data.title);
      try {
        const response = await packageAPI.create(data);
        console.log('✓ Package created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create package:', error.message);
        return { success: false, error: error.message };
      }
    },

    update: async (id, data) => {
      console.log('✏️ Updating package:', id);
      try {
        const response = await packageAPI.update(id, data);
        console.log('✓ Package updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update package:', error.message);
        return { success: false, error: error.message };
      }
    },

    delete: async (id) => {
      console.log('🗑️ Deleting package:', id);
      try {
        const response = await packageAPI.delete(id);
        console.log('✓ Package deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete package:', error.message);
        return { success: false, error: error.message };
      }
    },

    addDate: async (packageId, data) => {
      console.log('📅 Adding date to package:', packageId);
      try {
        const response = await packageAPI.addDate(packageId, data);
        console.log('✓ Date added');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to add date:', error.message);
        return { success: false, error: error.message };
      }
    },

    updateDate: async (packageId, dateId, data) => {
      console.log('✏️ Updating package date:', dateId);
      try {
        const response = await packageAPI.updateDate(packageId, dateId, data);
        console.log('✓ Date updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update date:', error.message);
        return { success: false, error: error.message };
      }
    },

    deleteDate: async (packageId, dateId) => {
      console.log('🗑️ Deleting package date:', dateId);
      try {
        const response = await packageAPI.deleteDate(packageId, dateId);
        console.log('✓ Date deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete date:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * BOOKING OPERATIONS
   */
  bookings: {
    getAll: async (filters = {}) => {
      console.log('📚 Fetching all bookings');
      try {
        const response = await bookingAPI.getAll(filters);
        const bookings = response.data?.data || response.data || [];
        console.log('✓ Bookings fetched:', Array.isArray(bookings) ? bookings.length : 0);
        return { success: true, data: bookings };
      } catch (error) {
        console.error('✗ Failed to fetch bookings:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('📖 Fetching booking:', id);
      try {
        const response = await bookingAPI.getById(id);
        console.log('✓ Booking fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    getByUser: async (userId) => {
      console.log('👤 Fetching user bookings:', userId);
      try {
        const response = await bookingAPI.getByUser(userId);
        const bookings = response.data?.data || response.data || [];
        console.log('✓ User bookings fetched:', Array.isArray(bookings) ? bookings.length : 0);
        return { success: true, data: bookings };
      } catch (error) {
        console.error('✗ Failed to fetch user bookings:', error.message);
        return { success: false, error: error.message };
      }
    },

    getSummary: async (userId) => {
      console.log('📊 Fetching booking summary:', userId);
      try {
        const response = await bookingAPI.getSummary(userId);
        console.log('✓ Summary fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch summary:', error.message);
        return { success: false, error: error.message };
      }
    },

    create: async (data) => {
      console.log('➕ Creating booking');
      try {
        const response = await bookingAPI.create(data);
        console.log('✓ Booking created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    update: async (id, data) => {
      console.log('✏️ Updating booking:', id);
      try {
        const response = await bookingAPI.update(id, data);
        console.log('✓ Booking updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    confirm: async (id) => {
      console.log('✅ Confirming booking:', id);
      try {
        const response = await bookingAPI.confirm(id);
        console.log('✓ Booking confirmed');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to confirm booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    cancel: async (id, reason = '') => {
      console.log('❌ Cancelling booking:', id);
      try {
        const response = await bookingAPI.cancel(id, reason);
        console.log('✓ Booking cancelled');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to cancel booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    complete: async (id) => {
      console.log('🏁 Completing booking:', id);
      try {
        const response = await bookingAPI.complete(id);
        console.log('✓ Booking completed');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to complete booking:', error.message);
        return { success: false, error: error.message };
      }
    },

    delete: async (id) => {
      console.log('🗑️ Deleting booking:', id);
      try {
        const response = await bookingAPI.delete(id);
        console.log('✓ Booking deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete booking:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * PAYMENT OPERATIONS
   */
  payments: {
    getAll: async (filters = {}) => {
      console.log('💳 Fetching all payments');
      try {
        const response = await paymentAPI.getAll(filters);
        const payments = response.data?.data || response.data || [];
        console.log('✓ Payments fetched:', Array.isArray(payments) ? payments.length : 0);
        return { success: true, data: payments };
      } catch (error) {
        console.error('✗ Failed to fetch payments:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('💳 Fetching payment:', id);
      try {
        const response = await paymentAPI.getById(id);
        console.log('✓ Payment fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch payment:', error.message);
        return { success: false, error: error.message };
      }
    },

    getByBooking: async (bookingId) => {
      console.log('💳 Fetching booking payments:', bookingId);
      try {
        const response = await paymentAPI.getByBooking(bookingId);
        const payments = response.data?.data || response.data || [];
        console.log('✓ Payments fetched:', Array.isArray(payments) ? payments.length : 0);
        return { success: true, data: payments };
      } catch (error) {
        console.error('✗ Failed to fetch payments:', error.message);
        return { success: false, error: error.message };
      }
    },

    getSummary: async (bookingId) => {
      console.log('💳 Fetching payment summary:', bookingId);
      try {
        const response = await paymentAPI.getSummary(bookingId);
        console.log('✓ Summary fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch summary:', error.message);
        return { success: false, error: error.message };
      }
    },

    create: async (data) => {
      console.log('💳 Creating payment');
      try {
        const response = await paymentAPI.create(data);
        console.log('✓ Payment created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create payment:', error.message);
        return { success: false, error: error.message };
      }
    },

    update: async (id, data) => {
      console.log('✏️ Updating payment:', id);
      try {
        const response = await paymentAPI.update(id, data);
        console.log('✓ Payment updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update payment:', error.message);
        return { success: false, error: error.message };
      }
    },

    confirm: async (id) => {
      console.log('✅ Confirming payment:', id);
      try {
        const response = await paymentAPI.confirm(id);
        console.log('✓ Payment confirmed');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to confirm payment:', error.message);
        return { success: false, error: error.message };
      }
    },

    reject: async (id, reason = '') => {
      console.log('❌ Rejecting payment:', id);
      try {
        const response = await paymentAPI.reject(id, reason);
        console.log('✓ Payment rejected');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to reject payment:', error.message);
        return { success: false, error: error.message };
      }
    },

    refund: async (paymentId, amount = null) => {
      console.log('💰 Processing refund:', paymentId);
      try {
        const response = await paymentAPI.refund(paymentId, amount);
        console.log('✓ Refund processed');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to process refund:', error.message);
        return { success: false, error: error.message };
      }
    },

    delete: async (id) => {
      console.log('🗑️ Deleting payment:', id);
      try {
        const response = await paymentAPI.delete(id);
        console.log('✓ Payment deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete payment:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * REVIEW OPERATIONS
   */
  reviews: {
    getAll: async (filters = {}) => {
      console.log('⭐ Fetching all reviews');
      try {
        const response = await reviewAPI.getAll(filters);
        const reviews = response.data?.data || response.data || [];
        console.log('✓ Reviews fetched:', Array.isArray(reviews) ? reviews.length : 0);
        return { success: true, data: reviews };
      } catch (error) {
        console.error('✗ Failed to fetch reviews:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('⭐ Fetching review:', id);
      try {
        const response = await reviewAPI.getById(id);
        console.log('✓ Review fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch review:', error.message);
        return { success: false, error: error.message };
      }
    },

    getByPackage: async (packageId) => {
      console.log('⭐ Fetching package reviews:', packageId);
      try {
        const response = await reviewAPI.getByPackage(packageId);
        const reviews = response.data?.data || response.data || [];
        console.log('✓ Reviews fetched:', Array.isArray(reviews) ? reviews.length : 0);
        return { success: true, data: reviews };
      } catch (error) {
        console.error('✗ Failed to fetch reviews:', error.message);
        return { success: false, error: error.message };
      }
    },

    getByUser: async (userId) => {
      console.log('⭐ Fetching user reviews:', userId);
      try {
        const response = await reviewAPI.getByUser(userId);
        const reviews = response.data?.data || response.data || [];
        console.log('✓ Reviews fetched:', Array.isArray(reviews) ? reviews.length : 0);
        return { success: true, data: reviews };
      } catch (error) {
        console.error('✗ Failed to fetch reviews:', error.message);
        return { success: false, error: error.message };
      }
    },

    getRatingSummary: async (packageId) => {
      console.log('⭐ Fetching rating summary:', packageId);
      try {
        const response = await reviewAPI.getRatingSummary(packageId);
        console.log('✓ Summary fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch summary:', error.message);
        return { success: false, error: error.message };
      }
    },

    create: async (data) => {
      console.log('➕ Creating review');
      try {
        const response = await reviewAPI.create(data);
        console.log('✓ Review created');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to create review:', error.message);
        return { success: false, error: error.message };
      }
    },

    update: async (id, data) => {
      console.log('✏️ Updating review:', id);
      try {
        const response = await reviewAPI.update(id, data);
        console.log('✓ Review updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update review:', error.message);
        return { success: false, error: error.message };
      }
    },

    delete: async (id) => {
      console.log('🗑️ Deleting review:', id);
      try {
        const response = await reviewAPI.delete(id);
        console.log('✓ Review deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete review:', error.message);
        return { success: false, error: error.message };
      }
    },
  },

  /**
   * ADMIN OPERATIONS
   */
  admin: {
    users: {
      create: async (userData) => {
        console.log('➕ Creating admin user:', userData.email);
        try {
          const response = await adminAPI.createUser(userData);
          console.log('✓ User created');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to create user:', error.message);
          return { success: false, error: error.message };
        }
      },

      getAll: async () => {
        console.log('👥 Fetching all admin users');
        try {
          const response = await adminAPI.getAllUsers();
          const users = response.data?.data || response.data || [];
          console.log('✓ Users fetched:', Array.isArray(users) ? users.length : 0);
          return { success: true, data: users };
        } catch (error) {
          console.error('✗ Failed to fetch users:', error.message);
          return { success: false, error: error.message };
        }
      },

      getById: async (userId) => {
        console.log('👤 Fetching admin user:', userId);
        try {
          const response = await adminAPI.getUserById(userId);
          console.log('✓ User fetched');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to fetch user:', error.message);
          return { success: false, error: error.message };
        }
      },

      updateRole: async (userId, roleData) => {
        console.log('✏️ Updating user role:', userId);
        try {
          const response = await adminAPI.updateUserRole(userId, roleData);
          console.log('✓ Role updated');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to update role:', error.message);
          return { success: false, error: error.message };
        }
      },

      delete: async (userId) => {
        console.log('🗑️ Deleting user:', userId);
        try {
          const response = await adminAPI.deleteUser(userId);
          console.log('✓ User deleted');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to delete user:', error.message);
          return { success: false, error: error.message };
        }
      },
    },

    dashboard: {
      getStats: async () => {
        console.log('📊 Fetching dashboard stats');
        try {
          const response = await adminAPI.getDashboardStats();
          console.log('✓ Stats fetched');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to fetch stats:', error.message);
          return { success: false, error: error.message };
        }
      },

      getRevenue: async (filters = {}) => {
        console.log('💰 Fetching revenue stats');
        try {
          const response = await adminAPI.getRevenueStats(filters);
          console.log('✓ Revenue stats fetched');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to fetch revenue stats:', error.message);
          return { success: false, error: error.message };
        }
      },

      getBookings: async (filters = {}) => {
        console.log('📚 Fetching booking stats');
        try {
          const response = await adminAPI.getBookingStats(filters);
          console.log('✓ Booking stats fetched');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to fetch booking stats:', error.message);
          return { success: false, error: error.message };
        }
      },

      getUsers: async () => {
        console.log('👥 Fetching user stats');
        try {
          const response = await adminAPI.getUserStats();
          console.log('✓ User stats fetched');
          return { success: true, data: response.data };
        } catch (error) {
          console.error('✗ Failed to fetch user stats:', error.message);
          return { success: false, error: error.message };
        }
      },
    },
  },

  /**
   * MASTER PACKAGES OPERATIONS
   */
  packageMaster: {
    getAll: async (page = 1, limit = 10) => {
      console.log('📦 Fetching master packages:', { page, limit });
      try {
        const response = await packageMasterAPI.getAll(page, limit);
        const packages = response.data?.data || response.data || [];
        console.log('✓ Master packages fetched:', Array.isArray(packages) ? packages.length : 0);
        return { success: true, data: packages };
      } catch (error) {
        console.error('✗ Failed to fetch master packages:', error.message);
        return { success: false, error: error.message };
      }
    },

    getById: async (id) => {
      console.log('📦 Fetching master package:', id);
      try {
        const response = await packageMasterAPI.getById(id);
        console.log('✓ Master package fetched');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to fetch master package:', error.message);
        return { success: false, error: error.message };
      }
    },

    getDates: async (id) => {
      console.log('📅 Fetching master package dates:', id);
      try {
        const response = await packageMasterAPI.getDates(id);
        const dates = response.data?.data || response.data || [];
        console.log('✓ Dates fetched:', Array.isArray(dates) ? dates.length : 0);
        return { success: true, data: dates };
      } catch (error) {
        console.error('✗ Failed to fetch dates:', error.message);
        return { success: false, error: error.message };
      }
    },

    getItineraries: async (id) => {
      console.log('📋 Fetching master package itineraries:', id);
      try {
        const response = await packageMasterAPI.getItineraries(id);
        const itineraries = response.data?.data || response.data || [];
        console.log('✓ Itineraries fetched:', Array.isArray(itineraries) ? itineraries.length : 0);
        return { success: true, data: itineraries };
      } catch (error) {
        console.error('✗ Failed to fetch itineraries:', error.message);
        return { success: false, error: error.message };
      }
    },

    addDate: async (packageId, data) => {
      console.log('📅 Adding date to master package:', packageId);
      try {
        const response = await packageMasterAPI.addDate(packageId, data);
        console.log('✓ Date added');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to add date:', error.message);
        return { success: false, error: error.message };
      }
    },

    updateDate: async (packageId, dateId, data) => {
      console.log('✏️ Updating master package date:', dateId);
      try {
        const response = await packageMasterAPI.updateDate(packageId, dateId, data);
        console.log('✓ Date updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update date:', error.message);
        return { success: false, error: error.message };
      }
    },

    deleteDate: async (packageId, dateId) => {
      console.log('🗑️ Deleting master package date:', dateId);
      try {
        const response = await packageMasterAPI.deleteDate(packageId, dateId);
        console.log('✓ Date deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete date:', error.message);
        return { success: false, error: error.message };
      }
    },

    addItinerary: async (packageId, data) => {
      console.log('📋 Adding itinerary to master package:', packageId);
      try {
        const response = await packageMasterAPI.addItinerary(packageId, data);
        console.log('✓ Itinerary added');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to add itinerary:', error.message);
        return { success: false, error: error.message };
      }
    },

    updateItinerary: async (packageId, itineraryId, data) => {
      console.log('✏️ Updating master package itinerary:', itineraryId);
      try {
        const response = await packageMasterAPI.updateItinerary(packageId, itineraryId, data);
        console.log('✓ Itinerary updated');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to update itinerary:', error.message);
        return { success: false, error: error.message };
      }
    },

    deleteItinerary: async (packageId, itineraryId) => {
      console.log('🗑️ Deleting master package itinerary:', itineraryId);
      try {
        const response = await packageMasterAPI.deleteItinerary(packageId, itineraryId);
        console.log('✓ Itinerary deleted');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('✗ Failed to delete itinerary:', error.message);
        return { success: false, error: error.message };
      }
    },
  },
};

export default apiIntegration;
