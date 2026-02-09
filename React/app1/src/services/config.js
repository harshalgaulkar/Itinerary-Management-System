import { API_BASE_URL } from './constants';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const APP_CONFIG = {
  name: 'IMS',
  version: '1.0.0',
  appDisplayName: 'IMS - Inventory Management System',
  debug: false,
};

export const AUTH_CONFIG = {
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const UI_CONFIG = {
  animationDuration: 300,
  toastDuration: 3000,
  pagingSize: 10,
};
