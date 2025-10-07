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

  // Register function
  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration to:', `${API_URL}/auth/register`);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login to:', `${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem("token", token);
      
      // Set user state
      setUser(user);
      
      console.log('✅ Login successful');
      return user;
    } catch (error) {
      console.error('❌ Login error:', error);
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