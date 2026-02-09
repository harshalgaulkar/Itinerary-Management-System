import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../utils/storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log('[AuthContext] Bootstrapping - checking for existing token...');
        const token = await storage.getItem('userToken');
        if (token) {
          console.log('[AuthContext] ✓ Token found in storage');
          setUserToken(token);
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            console.log('[AuthContext] ✓ User data found in storage');
            setUser(JSON.parse(userData));
          }
          // ensure axios/api default header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('[AuthContext] ✓ Authorization header set');
        } else {
          console.log('[AuthContext] No token found - user not logged in');
        }
      } catch (e) {
        console.error('[AuthContext] Failed to restore token:', e);
      } finally {
        console.log('[AuthContext] ✓ Bootstrap complete');
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    sign_in: async (email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[AuthContext] Attempting login with email:', email);
        const response = await api.post('/users/signin', { email, password });

        console.log('[AuthContext] Login response:', response.data);

        // backend returns { status: 'success'|'error', data: {...} } or { status: 'error', error: '...' }
        if (response.data?.status === 'error') {
          // Handle error response from backend
          const errMsg = response.data?.error || 'Login failed';
          console.log('[AuthContext] ✗ Backend returned error:', errMsg);
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        if (response.data && response.data.status === 'success' && response.data.data && response.data.data.token) {
          const token = response.data.data.token;
          const userData = response.data.data || { email };

          console.log('[AuthContext] Login successful, token received');
          await storage.setItem('userToken', token);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));

          console.log('[AuthContext] Token and user data saved to storage');
          setUserToken(token);
          console.log('[AuthContext] ✓ userToken state set:', !!token);
          
          setUser(userData);

          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return { success: true, user: userData };
        }
        
        // Unexpected response format
        const errMsg = response.data?.error || 'Invalid response from server';
        console.log('[AuthContext] ✗ Unexpected response format:', response.data);
        throw new Error(errMsg);
      } catch (err) {
        console.error('[AuthContext] ✗ Login error - Full error:', err);
        console.error('[AuthContext] Error response:', err.response?.data);
        console.error('[AuthContext] Error status:', err.response?.status);
        console.error('[AuthContext] Error message:', err.message);
        
        let errorMsg = 'Login failed';
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        console.log('[AuthContext] ✗ Login error:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },

    sign_up: async (userData) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[AuthContext] Attempting registration with email:', userData.email);
        const response = await api.post('/users/signup', userData);

        console.log('[AuthContext] Registration response:', response.data);

        // backend returns { status: 'success'|'error', data: {...} } or { status: 'error', error: '...' }
        if (response.data?.status === 'error') {
          // Handle error response from backend
          const errMsg = response.data?.error || 'Registration failed';
          console.log('[AuthContext] ✗ Backend returned error:', errMsg);
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        if (response.data && response.data.status === 'success' && response.data.data && response.data.data.token) {
          const token = response.data.data.token;
          const user = response.data.data || userData;

          console.log('[AuthContext] Registration successful, token received');
          await storage.setItem('userToken', token);
          await AsyncStorage.setItem('userData', JSON.stringify(user));

          console.log('[AuthContext] Token and user data saved to storage');
          setUserToken(token);
          console.log('[AuthContext] ✓ userToken state set:', !!token);
          
          setUser(user);

          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return { success: true, user };
        }

        // Unexpected response format
        const errMsg = response.data?.error || 'Invalid response from server';
        console.log('[AuthContext] ✗ Unexpected response format:', response.data);
        throw new Error(errMsg);
      } catch (err) {
        console.error('[AuthContext] ✗ Registration error - Full error:', err);
        console.error('[AuthContext] Error response:', err.response?.data);
        console.error('[AuthContext] Error status:', err.response?.status);
        console.error('[AuthContext] Error message:', err.message);
        
        let errorMsg = 'Registration failed';
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        console.log('[AuthContext] ✗ Registration error:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },

    sign_out: async () => {
      try {
        console.log('[AuthContext] Starting logout...');
        
        // Clear storage
        console.log('[AuthContext] Deleting userToken from storage...');
        await storage.deleteItem('userToken');
        
        console.log('[AuthContext] Removing userData from AsyncStorage...');
        await AsyncStorage.removeItem('userData');
        
        // Clear state
        console.log('[AuthContext] Clearing state...');
        setUserToken(null);
        setUser(null);
        setError(null);
        
        // Clear API auth header
        delete api.defaults.headers.common['Authorization'];
        
        console.log('[AuthContext] ✓ Logout completed successfully');
        return { success: true };
      } catch (err) {
        console.error('[AuthContext] ✗ Logout error:', err);
        const errorMsg = err.message || 'Logout failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },

    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider
      value={{
        ...authContext,
        user,
        isLoading,
        userToken,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
