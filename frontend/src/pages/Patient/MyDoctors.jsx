import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  Stethoscope, 
  Calendar,
  MapPin,
  Award,
  Clock,
  ArrowLeft,
  AlertCircle,
  Building
} from 'lucide-react';
import axios from 'axios';

const MyDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMyDoctors();
  }, []);

  const fetchMyDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/assignments/my-doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Doctors fetched:', response.data);
      setDoctors(response.data || []);

    } catch (error) {
      console.error('❌ Error fetching doctors:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        // No doctors assigned yet - not an error
        setDoctors([]);
      } else {
        toast.error('Failed to load assigned doctors');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your doctors...</p>
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
                onClick={() => navigate('/patient/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Stethoscope className="text-white" size={24} />
                  </div>
                  <span>My Doctors</span>
                </h1>
                <p className="text-gray-600 mt-1">Healthcare professionals assigned to you</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Doctors</p>
              <p className="text-3xl font-bold text-blue-900">{doctors.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium">Active Assignments</p>
              <p className="text-3xl font-bold text-green-900">
                {doctors.filter(d => d.status === 'active').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Specializations</p>
              <p className="text-3xl font-bold text-purple-900">
                {new Set(doctors.map(d => d.doctorId?.specialization || d.specialization)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((assignment, index) => {
              const doctor = assignment.doctorId || assignment;
              return (
                <div 
                  key={assignment._id || index} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Doctor Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-blue-100 text-sm flex items-center space-x-1">
                          <Award size={14} />
                          <span>{doctor.specialization || 'General Practice'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-6 space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="text-blue-600" size={16} />
                        </div>
                        <span className="text-sm truncate">{doctor.email || 'N/A'}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="text-green-600" size={16} />
                        </div>
                        <span className="text-sm">{doctor.phone || doctor.phoneNumber || 'N/A'}</span>
                      </div>

                      {doctor.hospitalName && (
                        <div className="flex items-center space-x-3 text-gray-700">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="text-purple-600" size={16} />
                          </div>
                          <span className="text-sm">{doctor.hospitalName}</span>
                        </div>
                      )}

                      {doctor.address && (
                        <div className="flex items-center space-x-3 text-gray-700">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-orange-600" size={16} />
                          </div>
                          <span className="text-sm">{doctor.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Assignment Info */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} />
                          <span>Assigned</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatDate(assignment.assignedDate || assignment.createdAt)}
                        </span>
                      </div>

                      {assignment.status && (
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            assignment.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assignment.status?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      <button
                        onClick={() => navigate(`/patient/doctor/${doctor._id}`)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        View Full Profile
                      </button>
                      {doctor.email && (
                        <button
                          onClick={() => window.location.href = `mailto:${doctor.email}`}
                          className="w-full px-4 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Contact Doctor
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // No Doctors Assigned
          <div className="bg-white rounded-xl shadow-md p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Assigned Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any doctors assigned to you yet. Please contact the administrator or wait for a doctor to be assigned to your account.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigate('/patient/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:admin@meditrack.com'}
                  className="px-6 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDoctors;