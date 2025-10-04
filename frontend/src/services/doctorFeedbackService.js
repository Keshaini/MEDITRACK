import API from './api';

export const doctorFeedbackService = {
  // Doctor provides feedback on health log
  provideFeedback: async (feedbackData) => {
    const response = await API.post('/doctor-feedback', feedbackData);
    return response.data;
  },

  // Get feedback for a specific health log
  getFeedbackByHealthLog: async (healthLogId) => {
    const response = await API.get(`/doctor-feedback/healthlog/${healthLogId}`);
    return response.data;
  },

  // Get all feedback for current patient
  getPatientFeedback: async () => {
    const response = await API.get('/doctor-feedback/patient');
    return response.data;
  },

  // Get all feedback given by a doctor
  getDoctorFeedback: async (doctorId) => {
    const response = await API.get(`/doctor-feedback/doctor/${doctorId}`);
    return response.data;
  },

  // Update feedback
  updateFeedback: async (feedbackId, feedbackData) => {
    const response = await API.put(`/doctor-feedback/${feedbackId}`, feedbackData);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    const response = await API.delete(`/doctor-feedback/${feedbackId}`);
    return response.data;
  },

  // Get feedback history with filters
  getFeedbackHistory: async (filters = {}) => {
    const response = await API.get('/doctor-feedback/history', { params: filters });
    return response.data;
  },
};