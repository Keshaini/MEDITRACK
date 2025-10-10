import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Create a new health log
 * @param {Object} healthLogData - The health log form data
 * @param {string} token - The user's auth token
 */
export const createHealthLog = async (healthLogData, token) => {
  try {
    const response = await axios.post(`${API_URL}/healthlogs`, healthLogData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating health log:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch all health logs for a patient
 * @param {string} token - The user's auth token
 */
export const getHealthLogs = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/healthlogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching health logs:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch a single health log by ID
 * @param {string} id - The health log ID
 * @param {string} token - The user's auth token
 */
export const getHealthLogById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/healthlogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching health log:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update a health log
 * @param {string} id - The health log ID
 * @param {Object} updatedData - The updated log details
 * @param {string} token - The user's auth token
 */
export const updateHealthLog = async (id, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/healthlogs/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating health log:", error);
    throw error.response?.data || error;
  }
};

/**
 * Delete a health log
 * @param {string} id - The health log ID
 * @param {string} token - The user's auth token
 */
export const deleteHealthLog = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/healthlogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting health log:", error);
    throw error.response?.data || error;
  }
};
