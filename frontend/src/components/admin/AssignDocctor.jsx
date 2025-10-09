import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Users, UserCheck, Search, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AssignDoctor = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [patientsRes, doctorsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/patients`, { headers: { Authorization: `Bearer ${token}` }}).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/admin/doctors`, { headers: { Authorization: `Bearer ${token}` }}).catch(() => ({ data: [] }))
      ]);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPatient || !selectedDoctor) {
      toast.error('Please select both patient and doctor');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/assign-doctor`, {
        patientId: selectedPatient._id,
        doctorId: selectedDoctor._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Doctor assigned successfully!');
      setTimeout(() => navigate('/admin/assignments'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <UserPlus className="text-white" size={24} />
                  </div>
                  <span>Assign Doctor to Patient</span>
                </h1>
                <p className="text-gray-600 mt-1">Create doctor-patient assignments (DP001)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Select Patient */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Users className="text-blue-500" size={24} />
              <span>Select Patient</span>
            </h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            {selectedPatient && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <p className="font-semibold text-blue-900">✓ Selected Patient</p>
                <p className="text-blue-700">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                <p className="text-sm text-blue-600">{selectedPatient.email}</p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                <div
                  key={patient._id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?._id === patient._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-semibold">{patient.firstName} {patient.lastName}</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <p className="text-xs text-gray-500">Age: {patient.age || 'N/A'} | Gender: {patient.gender}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto mb-2" size={48} />
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>

          {/* Select Doctor */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <UserCheck className="text-green-500" size={24} />
              <span>Select Doctor</span>
            </h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
              />
            </div>

            {selectedDoctor && (
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="font-semibold text-green-900">✓ Selected Doctor</p>
                <p className="text-green-700">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                <p className="text-sm text-green-600">{selectedDoctor.specialization}</p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                <div
                  key={doctor._id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedDoctor?._id === doctor._id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <p className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500">{doctor.email}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto mb-2" size={48} />
                  <p>No doctors found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Summary */}
        {(selectedPatient || selectedDoctor) && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Assignment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Patient</p>
                <p className="font-bold text-blue-900">
                  {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Not selected'}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Doctor</p>
                <p className="font-bold text-green-900">
                  {selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` : 'Not selected'}
                </p>
              </div>
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedPatient || !selectedDoctor || saving}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Assign Doctor to Patient</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignDoctor;