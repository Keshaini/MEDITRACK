import React, { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, getProfile } from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Load user on mount ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const profileData = await getProfile();
          setUser(profileData);
        }
      } catch (err) {
        console.error("Error loading user profile:", err.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- Register new user ---
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      toast.success("Registration successful! Please login.");
      return response;
    } catch (error) {
      console.error("Registration failed:", error.message);
      throw error; // handled in Register.jsx
    }
  };

  // --- Login user ---
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      toast.success("Login successful!");
      return response;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  // --- Logout user ---
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
