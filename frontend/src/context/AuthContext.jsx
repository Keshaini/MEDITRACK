import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base API URL
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if token exists and verify it
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token with backend
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Register function - THIS WAS MISSING
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Optionally auto-login after registration
      // Uncomment below if you want users logged in immediately after registration
      /*
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      */
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem("token", token);
      
      // Set user state
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}