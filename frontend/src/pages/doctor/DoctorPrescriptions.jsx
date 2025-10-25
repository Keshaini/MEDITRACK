// src/pages/Doctor/DoctorPrescriptions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // 🔹 Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/prescriptions/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  // 🔹 Fetch assigned patients for dropdown
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/users/doctor/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // 🔹 Add new prescription
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/prescriptions`, newPrescription, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Prescription created successfully ✅");
      setNewPrescription({ patientId: "", medication: "", dosage: "", instructions: "" });
      fetchPrescriptions();
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Failed to create prescription ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🩺 Doctor Prescriptions</h2>

      {/* Create New Prescription */}
      <Card className="p-4 mb-4 shadow-sm">
        <h5>Create New Prescription</h5>
        <Form onSubmit={handleAddPrescription}>
          <Form.Group className="mb-3">
            <Form.Label>Patient</Form.Label>
            <Form.Select
              required
              value={newPrescription.patientId}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, patientId: e.target.value })
              }
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Medication</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter medication name"
              value={newPrescription.medication}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, medication: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dosage</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g., 1 tablet twice a day"
              value={newPrescription.dosage}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, dosage: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter additional instructions"
              value={newPrescription.instructions}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, instructions: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Prescription"}
          </Button>
        </Form>
      </Card>

      {/* Prescription List */}
      <Card className="p-4 shadow-sm">
        <h5>Existing Prescriptions</h5>
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Instructions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((p) => (
                <tr key={p._id}>
                  <td>{p.patient?.firstName} {p.patient?.lastName}</td>
                  <td>{p.medication}</td>
                  <td>{p.dosage}</td>
                  <td>{p.instructions}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default DoctorPrescriptions;
