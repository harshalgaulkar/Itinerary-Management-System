import React, { createContext, useContext, useState, useEffect } from "react";
import { userAPI } from "../services/endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
          const response = await userAPI.getProfile(userId);
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await userAPI.signin(email, password);
      const userData = response.data.data;

      // Store auth data
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userId", userData.user_id);
      localStorage.setItem("userRole", userData.role);

      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await userAPI.signup(userData);
      const newUser = response.data.data;

      // Store auth data
      localStorage.setItem("authToken", newUser.token);
      localStorage.setItem("userId", newUser.user_id);
      localStorage.setItem("userRole", newUser.role);

      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await userAPI.updateProfile(user.user_id, updates);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Update failed";
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
