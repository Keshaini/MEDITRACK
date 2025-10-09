import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Activity,
  FileText,
  UserCheck,
  Bell,
  Plus,
  Eye,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  AlertCircle,
  LogOut
} from 'lucide-react';
import axios from 'axios';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalHealthLogs: 0,
      totalMedicalRecords: 0,
      assignedDoctor: null,
      pendingAlerts: 0
    },
    recentHealthLogs: [],
    recentMedicalHistory: []
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all dashboard data
      const [healthLogsRes, medicalHistoryRes, doctorRes] = await Promise.all([
        axios.get(`${API_URL}/healthlogs`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/medical`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/doctor/assigned`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: null }))
      ]);

      setDashboardData({
        stats: {
          totalHealthLogs: healthLogsRes.data?.length || 0,
          totalMedicalRecords: medicalHistoryRes.data?.length || 0,
          assignedDoctor: doctorRes.data,
          pendingAlerts: 0 // Placeholder, implement alert fetching logic if needed
        },
        recentHealthLogs: healthLogsRes.data?.slice(0, 5) || [],
        recentMedicalHistory: medicalHistoryRes.data?.slice(0, 3) || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLastLoginTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MediTrack</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Patient'}! 👋
              </h2>
              <p className="text-primary-100 flex items-center space-x-2">
                <Clock size={16} />
                <span>Last login: Today at {getLastLoginTime()}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Health Logs Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Health Logs</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalHealthLogs}</p>
            <button
              onClick={() => navigate('/patient/health-logs')}
              className="mt-3 text-primary-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Medical Records Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Medical Records</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalMedicalRecords}</p>
            <button
              onClick={() => navigate('/patient/medical-history')}
              className="mt-3 text-primary-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Assigned Doctor Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Assigned Doctor</h3>
            <p className="text-xl font-bold text-gray-900">
              {dashboardData.stats.assignedDoctor 
                ? `Dr. ${dashboardData.stats.assignedDoctor.name}`
                : 'Not Assigned'}
            </p>
            <button
              onClick={() => navigate('/patient/my-doctors')}
              className="mt-3 text-primary-500 text-sm font-medium hover:underline"
            >
              View details →
            </button>
          </div>

          {/* Alerts Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Bell className="text-red-600" size={24} />
              </div>
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Alerts</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.pendingAlerts}</p>
            <button
              onClick={() => navigate('/patient/notifications')}
              className="mt-3 text-primary-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="text-primary-500" size={24} />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/patient/add-health-log')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="text-blue-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Add Health Log</span>
            </button>

            <button
              onClick={() => navigate('/patient/add-medical-history')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FileText className="text-green-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Add Medical Record</span>
            </button>

            <button
              onClick={() => navigate('/patient/health-logs')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Eye className="text-purple-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">View Health Logs</span>
            </button>

            <button
              onClick={() => navigate('/patient/profile')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <UserCheck className="text-orange-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">My Profile</span>
            </button>
          </div>
        </div>

        {/* Recent Health Logs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Heart className="text-red-500" size={24} />
              <span>Recent Health Logs</span>
            </h3>
            <button
              onClick={() => navigate('/patient/health-logs')}
              className="text-primary-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {dashboardData.recentHealthLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Blood Pressure</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Heart Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Temperature</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentHealthLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(log.date)}</td>
                      <td className="py-3 px-4">{log.bloodPressure || 'N/A'}</td>
                      <td className="py-3 px-4">{log.heartRate ? `${log.heartRate} bpm` : 'N/A'}</td>
                      <td className="py-3 px-4">{log.temperature ? `${log.temperature}°F` : 'N/A'}</td>
                      <td className="py-3 px-4">{log.weight ? `${log.weight} kg` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No health logs yet</p>
              <button
                onClick={() => navigate('/patient/add-health-log')}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Your First Log
              </button>
            </div>
          )}
        </div>

        {/* Recent Medical History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="text-green-500" size={24} />
              <span>Recent Medical Records</span>
            </h3>
            <button
              onClick={() => navigate('/patient/medical-history')}
              className="text-primary-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {dashboardData.recentMedicalHistory.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentMedicalHistory.map((record, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                  onClick={() => navigate(`/patient/medical-history/${record._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{record.condition || 'Medical Record'}</h4>
                      <p className="text-sm text-gray-600 mt-1">{record.diagnosis || 'No diagnosis provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{formatDate(record.date)}</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {record.type || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No medical records yet</p>
              <button
                onClick={() => navigate('/patient/add-medical-history')}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Your First Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;