// src/services/patientService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Get patient dashboard data
export const getPatientDashboard = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/patients/${patientId}/dashboard`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get patient profile
export const getPatientProfile = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/patients/${patientId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update patient profile
export const updatePatientProfile = async (patientId, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/patients/${patientId}`,
      data,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get assigned doctor
export const getAssignedDoctor = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/doctor/assigned/${patientId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getPatientDashboard,
  getPatientProfile,
  updatePatientProfile,
  getAssignedDoctor
};