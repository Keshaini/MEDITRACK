import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// --- Register user ---
export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return data; // backend response body
  } catch (error) {
    const message =
      error.response?.data?.message || "Server error during registration";
    throw new Error(message);
  }
};

// --- Login user ---
export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    // Ensure data has both token and user
    if (!data.token || !data.user) {
      throw new Error("Invalid server response");
    }
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Invalid email or password";
    throw new Error(message);
  }
};

// --- Get logged-in user's profile ---
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const { data } = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Unable to fetch user profile";
    throw new Error(message);
  }
};
