import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, FileText, Phone, Mail, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, doctors]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/doctors/verification', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.verificationStatus === filterStatus);
    }
    setFilteredDoctors(filtered);
  };

  const verifyDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to verify this doctor?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setDoctors(prev => prev.map(d => 
          d.id === doctorId ? { ...d, verificationStatus: 'verified' } : d
        ));
        alert('Doctor verified successfully');
      }
    } catch (error) {
      console.error('Error verifying doctor:', error);
      alert('Failed to verify doctor');
    }
  };

  const rejectDoctor = async (doctorId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      
      if (response.ok) {
        setDoctors(prev => prev.map(d => 
          d.id === doctorId ? { ...d, verificationStatus: 'rejected', rejectionReason } : d
        ));
        setShowModal(false);
        setRejectionReason('');
        setSelectedDoctor(null);
        alert('Doctor rejected');
      }
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to reject doctor');
    }
  };

  const viewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      'verified': { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="h-4 w-4" /> }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Verification</h1>
          <p className="text-gray-600">Review and verify doctor registrations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {doctors.filter(d => d.verificationStatus === 'pending').length}
                </p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Verified</p>
                <p className="text-3xl font-bold text-green-600">
                  {doctors.filter(d => d.verificationStatus === 'verified').length}
                </p>
              </div>
              <UserCheck className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {doctors.filter(d => d.verificationStatus === 'rejected').length}
                </p>
              </div>
              <UserX className="h-10 w-10 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Doctors</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">No doctors match the selected filter</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => {
              const statusBadge = getStatusBadge(doctor.verificationStatus);
              return (
                <div key={doctor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-blue-100 rounded-full p-3">
                          <UserCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.icon}
                              <span>{doctor.verificationStatus}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{doctor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Applied: {new Date(doctor.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Specialization</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.specialization}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">License Number</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.licenseNumber}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Experience</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.experience} years</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Qualification</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.qualification}</p>
                              </div>
                            </div>
                          </div>

                          {doctor.documents && doctor.documents.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                              <div className="flex flex-wrap gap-2">
                                {doctor.documents.map((doc, idx) => (
                                  <a
                                    key={idx}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700"
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span>{doc.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {doctor.verificationStatus === 'rejected' && doctor.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-red-800">{doctor.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {doctor.verificationStatus === 'pending' && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => verifyDoctor(doctor.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowModal(true);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => viewDetails(doctor)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
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

        {showModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reject Doctor Application
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting {selectedDoctor.name}'s application:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => rejectDoctor(selectedDoctor.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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