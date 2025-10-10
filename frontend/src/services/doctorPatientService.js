// src/services/doctorPatientService.js
import API from "./api";

// ✅ Assign a doctor to a patient
export const assignDoctor = async (data) => {
  const res = await API.post("/assignments", data);
  return res.data;
};

// ✅ Get all doctor–patient assignments
export const getAssignments = async () => {
  const res = await API.get("/assignments");
  return res.data;
};

// ✅ Get patients assigned to a doctor
export const getPatientsByDoctor = async (doctorId) => {
  const res = await API.get(`/assignments/doctor/${doctorId}`);
  return res.data;
};

// ✅ Delete assignment
export const deleteAssignment = async (assignmentId) => {
  const res = await API.delete(`/assignments/${assignmentId}`);
  return res.data;
};

// ✅ Get doctors assigned to a patient
export const getDoctorsByPatient = async (patientId) => {
  const res = await API.get(`/assignments/patient/${patientId}`);
  return res.data;
};
// ✅ Update assignment details
export const updateAssignment = async (assignmentId, data) => {
  const res = await API.put(`/assignments/${assignmentId}`, data);
  return res.data;
};

// ✅ Get a specific assignment by ID
export const getAssignmentById = async (assignmentId) => {
  const res = await API.get(`/assignments/${assignmentId}`);
  return res.data;
};

// ✅ Get all doctors  
export const getAllDoctors = async () => {                      
    const res = await API.get("/doctors");
    return res.data;
};  

// ✅ Get all patients  