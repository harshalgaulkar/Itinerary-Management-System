// API Configuration
export const API_BASE_URL = 'http://localhost:4000';
export const API_TIMEOUT = 10000;

// Color Scheme
export const COLORS = {
  primary: '#007AFF',
  secondary: '#2c3e50',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  lightGray: '#ecf0f1',
  darkGray: '#34495e',
  white: '#ffffff',
  black: '#000000',
  border: '#bdc3c7',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  THEME: 'theme',
};

// Screen Names
export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  SPLASH: 'Splash',

  // Main Tabs
  PACKAGES: 'Packages',
  DESTINATIONS: 'Destinations',
  PAYMENTS: 'Payments',

  // Details
  PACKAGE_DETAILS: 'PackageDetails',
  DESTINATION_DETAILS: 'DestinationDetails',
  REVIEWS: 'Reviews',

  // Payment
  PAYMENT: 'Payment',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  REGISTER_SUCCESS: 'Account created successfully.',
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
};
