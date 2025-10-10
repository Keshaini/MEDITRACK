import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register user (patient/doctor/admin)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // If backend sent an error
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      // Network or server down
      throw new Error("Server not reachable. Please try again later.");
    }
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Server not reachable. Please try again later.");
    }
  }
};

// Get logged-in user info
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    throw new Error("Unable to fetch user info");
  }
};
