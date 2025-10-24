import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserCheck, 
  UserX, 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  ArrowLeft,
  Award
} from 'lucide-react';
import axios from 'axios';

const DoctorVerification = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Inactive');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Use correct endpoint
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ✅ FIX: Handle nested data and filter for doctors only
      const allUsers = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const doctorUsers = allUsers.filter(u => u.role === 'doctor');
      
      setDoctors(doctorUsers);
      setFilteredDoctors(doctorUsers);
      
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];
    
    if (filterStatus === 'Active') {
      filtered = filtered.filter(doc => doc.accountStatus === 'Active');
    } else if (filterStatus === 'Inactive') {
      filtered = filtered.filter(doc => doc.accountStatus === 'Inactive');
    } else if (filterStatus === 'Locked') {
      filtered = filtered.filter(doc => doc.accountStatus === 'Locked');
    }
    // 'all' shows everything
    
    setFilteredDoctors(filtered);
  };

  const verifyDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to verify and activate this doctor?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Use correct endpoint to update user status
      await axios.put(`${API_URL}/users/${doctorId}`, 
        { accountStatus: 'Active' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setDoctors(prev => prev.map(d => 
        d._id === doctorId ? { ...d, accountStatus: 'Active' } : d
      ));
      
      toast.success('Doctor verified and activated successfully!');
      
    } catch (error) {
      console.error('Error verifying doctor:', error);
      toast.error('Failed to verify doctor');
    }
  };

  const rejectDoctor = async (doctorId) => {
    if (!rejectionReason.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // ✅ Update status to Locked with rejection reason
      await axios.put(`${API_URL}/users/${doctorId}`, 
        { 
          accountStatus: 'Locked',
          rejectionReason: rejectionReason 
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setDoctors(prev => prev.map(d => 
        d._id === doctorId ? { ...d, accountStatus: 'Locked', rejectionReason } : d
      ));
      
      setShowModal(false);
      setRejectionReason('');
      setSelectedDoctor(null);
      
      toast.success('Doctor application rejected');
      
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Failed to reject doctor');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Inactive': { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      'Active': { bg: 'bg-green-100 border-green-300', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
      'Locked': { bg: 'bg-red-100 border-red-300', text: 'text-red-800', icon: <XCircle className="h-4 w-4" /> }
    };
    return badges[status] || badges.Inactive;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Verification</h1>
                <p className="text-gray-600">Review and verify doctor registrations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-blue-900">{doctors.length}</p>
              </div>
              <UserCheck className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {doctors.filter(d => d.accountStatus === 'Inactive').length}
                </p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-green-600">
                  {doctors.filter(d => d.accountStatus === 'Active').length}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {doctors.filter(d => d.accountStatus === 'Locked').length}
                </p>
              </div>
              <UserX className="h-10 w-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="all">All Doctors</option>
            <option value="Inactive">Pending Verification</option>
            <option value="Active">Verified</option>
            <option value="Locked">Rejected</option>
          </select>
        </div>

        {/* Doctors List */}
        <div className="space-y-6">
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">No doctors match the selected filter</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => {
              const statusBadge = getStatusBadge(doctor.accountStatus);
              return (
                <div key={doctor._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-4">
                          <UserCheck className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center space-x-1 ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.icon}
                              <span>{doctor.accountStatus}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4 text-blue-500" />
                              <span>{doctor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4 text-green-500" />
                              <span>{doctor.phone || doctor.phoneNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span>Applied: {new Date(doctor.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3 border-2 border-blue-100">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-600 mb-1 font-medium">Specialization</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center space-x-1">
                                  <Award size={14} className="text-blue-600" />
                                  <span>{doctor.specialization || 'General Practice'}</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1 font-medium">License Number</p>
                                <p className="text-sm font-bold text-gray-900">{doctor.licenseNumber || 'N/A'}</p>
                              </div>
                              {doctor.hospitalName && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-600 mb-1 font-medium">Hospital</p>
                                  <p className="text-sm font-bold text-gray-900">{doctor.hospitalName}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {doctor.accountStatus === 'Locked' && doctor.rejectionReason && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                              <p className="text-sm font-bold text-red-900 mb-1 flex items-center space-x-2">
                                <XCircle size={16} />
                                <span>Rejection Reason:</span>
                              </p>
                              <p className="text-sm text-red-800">{doctor.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {doctor.accountStatus === 'Inactive' && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => verifyDoctor(doctor._id)}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                          >
                            <CheckCircle className="h-5 w-5" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowModal(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                          >
                            <XCircle className="h-5 w-5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rejection Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reject Doctor Application
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting <span className="font-semibold">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</span>'s application:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                placeholder="Enter rejection reason (required)..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => rejectDoctor(selectedDoctor._id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVerification;