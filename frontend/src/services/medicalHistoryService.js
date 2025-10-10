import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/medicalhistory";

// ✅ Add new medical record
export const addMedicalHistory = async (historyData, token) => {
  const res = await axios.post(API_URL, historyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get all records for a patient
export const getMedicalHistoryByPatient = async (patientId, token) => {
  const res = await axios.get(`${API_URL}/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get a single medical record
export const getMedicalHistoryById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update existing medical record
export const updateMedicalHistory = async (id, historyData, token) => {
  const res = await axios.put(`${API_URL}/${id}`, historyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Delete a record
export const deleteMedicalHistory = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
