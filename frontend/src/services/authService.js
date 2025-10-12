// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // update if your backend runs elsewhere

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
};
