import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  UserPlus,
  Users,
  UserCheck,
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  User
} from 'lucide-react';
import axios from 'axios';

const AssignDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // ✅ Fetch all users and filter by role
      const usersRes = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allUsers = usersRes.data || [];
      const patientList = allUsers.filter(u => u.role === 'patient');
      const doctorList = allUsers.filter(u => u.role === 'doctor');

      setPatients(patientList);
      setDoctors(doctorList);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load patients and doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      // ✅ Use correct endpoint /api/assignments/assign
      await axios.post(`${API_URL}/assignments/assign`, 
        {
          patientId: selectedPatient,
          doctorId: selectedDoctor,
          notes: notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('✅ Doctor assigned to patient successfully!');
      
      // Reset form
      setSelectedPatient('');
      setSelectedDoctor('');
      setNotes('');
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error assigning doctor:', error);
      toast.error(error.response?.data?.error || 'Failed to assign doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  const selectedPatientData = patients.find(p => p._id === selectedPatient);
  const selectedDoctorData = doctors.find(d => d._id === selectedDoctor);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <UserPlus className="text-white" size={24} />
                  </div>
                  <span>Assign Doctor to Patient</span>
                </h1>
                <p className="text-gray-600 mt-1">Create a new doctor-patient assignment</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Available Patients</p>
              <p className="text-3xl font-bold text-blue-900">{patients.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium">Available Doctors</p>
              <p className="text-3xl font-bold text-green-900">{doctors.length}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Patient */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="text-blue-500" size={24} />
              <span>Select Patient</span>
            </h2>

            {/* Search Patient */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <div
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPatient === patient._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        <p className="text-xs text-gray-500">{patient.phone || 'No phone'}</p>
                      </div>
                      {selectedPatient === patient._id && (
                        <CheckCircle className="text-blue-500" size={24} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">No patients found</p>
                </div>
              )}
            </div>
          </div>

          {/* Select Doctor */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Stethoscope className="text-green-500" size={24} />
              <span>Select Doctor</span>
            </h2>

            {/* Search Doctor */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search doctors by name, specialization or email..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
            </div>

            {/* Doctor Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDoctor === doctor._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="text-green-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {doctor.specialization || 'General Practice'}
                        </p>
                        <p className="text-xs text-gray-500">{doctor.email}</p>
                      </div>
                      {selectedDoctor === doctor._id && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">No doctors found</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add any additional notes about this assignment..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            />
          </div>

          {/* Assignment Summary */}
          {(selectedPatientData || selectedDoctorData) && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assignment Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Patient</p>
                  {selectedPatientData ? (
                    <>
                      <p className="font-bold text-gray-900">
                        {selectedPatientData.firstName} {selectedPatientData.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedPatientData.email}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Not selected</p>
                  )}
                </div>

                <div className="text-center">
                  <div className="inline-block p-3 bg-white rounded-full">
                    <span className="text-2xl">→</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">will be assigned to</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Doctor</p>
                  {selectedDoctorData ? (
                    <>
                      <p className="font-bold text-gray-900">
                        Dr. {selectedDoctorData.firstName} {selectedDoctorData.lastName}
                      </p>
                      <p className="text-sm text-green-600">{selectedDoctorData.specialization || 'General'}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Not selected</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              disabled={submitting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedPatient || !selectedDoctor}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Assign Doctor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignDoctor;