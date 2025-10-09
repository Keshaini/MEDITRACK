import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileText,
  Activity,
  Clock,
  Heart,
  Thermometer,
  LogOut,
  UserPlus,
  Send
} from 'lucide-react';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      pendingFeedback: 0,
      feedbackToday: 0,
      criticalAlerts: 0
    },
    assignedPatients: [],
    recentFeedback: [],
    criticalPatients: []
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all doctor dashboard data
      const [patientsRes, feedbackRes, alertsRes] = await Promise.all([
        axios.get(`${API_URL}/doctor/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/doctor/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/doctor/alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      // Calculate stats
      const patients = patientsRes.data || [];
      const feedback = feedbackRes.data || [];
      const alerts = alertsRes.data || [];

      // Filter today's feedback
      const today = new Date().toDateString();
      const todayFeedback = feedback.filter(f => 
        new Date(f.createdAt).toDateString() === today
      );

      // Filter pending feedback (patients with logs but no recent feedback)
      const pendingCount = patients.filter(p => p.hasPendingLogs).length;

      setDashboardData({
        stats: {
          totalPatients: patients.length,
          pendingFeedback: pendingCount,
          feedbackToday: todayFeedback.length,
          criticalAlerts: alerts.length
        },
        assignedPatients: patients.slice(0, 8), // Show first 8
        recentFeedback: feedback.slice(0, 5),
        criticalPatients: alerts.slice(0, 4)
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

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVitalStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'normal': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getVitalIcon = (status) => {
    switch(status) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'normal': return '✅';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MediTrack</h1>
                <p className="text-xs text-gray-500">Doctor Portal</p>
              </div>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome, Dr. {user?.lastName || 'Doctor'}! 👨‍⚕️
              </h2>
              <p className="text-blue-100 mb-2">
                Specialization: {user?.specialization || 'General Physician'}
              </p>
              <p className="text-blue-200 text-sm flex items-center space-x-2">
                <Clock size={16} />
                <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Assigned Patients</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalPatients}</p>
            <button
              onClick={() => navigate('/doctor/patients')}
              className="mt-3 text-blue-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Pending Feedback */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Feedback</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.pendingFeedback}</p>
            <button
              onClick={() => navigate('/doctor/pending-feedback')}
              className="mt-3 text-yellow-600 text-sm font-medium hover:underline"
            >
              Review now →
            </button>
          </div>

          {/* Feedback Today */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Feedback Today</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.feedbackToday}</p>
            <button
              onClick={() => navigate('/doctor/feedback-history')}
              className="mt-3 text-green-600 text-sm font-medium hover:underline"
            >
              View history →
            </button>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center animate-pulse">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Critical Alerts</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.criticalAlerts}</p>
            <button
              onClick={() => navigate('/doctor/alerts')}
              className="mt-3 text-red-600 text-sm font-medium hover:underline"
            >
              View alerts →
            </button>
          </div>
        </div>

        {/* Critical Patients Alert Banner */}
        {dashboardData.criticalPatients.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8 shadow-md">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Critical Patients Require Attention</h3>
                <p className="text-red-700 mb-4">
                  {dashboardData.criticalPatients.length} patient{dashboardData.criticalPatients.length > 1 ? 's have' : ' has'} abnormal vital signs
                </p>
                <div className="space-y-2">
                  {dashboardData.criticalPatients.map((patient, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-sm text-red-600">{patient.issue}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Review Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="text-blue-500" size={24} />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/doctor/patients')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Users className="text-blue-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">My Patients</span>
            </button>

            <button
              onClick={() => navigate('/doctor/provide-feedback')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Send className="text-green-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Give Feedback</span>
            </button>

            <button
              onClick={() => navigate('/doctor/feedback-history')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FileText className="text-purple-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Feedback History</span>
            </button>

            <button
              onClick={() => navigate('/doctor/profile')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="text-orange-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">My Profile</span>
            </button>
          </div>
        </div>

        {/* Assigned Patients List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Heart className="text-red-500" size={24} />
              <span>My Patients</span>
            </h3>
            <button
              onClick={() => navigate('/doctor/patients')}
              className="text-blue-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {dashboardData.assignedPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.assignedPatients.map((patient, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md"
                  onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name || 'Patient'}</h4>
                        <p className="text-sm text-gray-600">Age: {patient.age || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getVitalStatusColor(patient.vitalStatus)}`}>
                      {getVitalIcon(patient.vitalStatus)} {patient.vitalStatus || 'Unknown'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className="text-red-500" />
                      <span className="text-gray-600">BP: {patient.lastBP || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity size={16} className="text-blue-500" />
                      <span className="text-gray-600">HR: {patient.lastHR || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer size={16} className="text-orange-500" />
                      <span className="text-gray-600">Temp: {patient.lastTemp || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600">Last: {formatDate(patient.lastLog)}</span>
                    </div>
                  </div>

                  {patient.hasPendingLogs && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs font-medium text-yellow-600 flex items-center space-x-1">
                        <MessageSquare size={14} />
                        <span>Pending feedback required</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No patients assigned yet</p>
              <p className="text-sm text-gray-400">Contact admin to get patients assigned</p>
            </div>
          )}
        </div>

        {/* Recent Feedback Given */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="text-green-500" size={24} />
              <span>Recent Feedback</span>
            </h3>
            <button
              onClick={() => navigate('/doctor/feedback-history')}
              className="text-blue-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {dashboardData.recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentFeedback.map((feedback, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{feedback.patientName}</h4>
                      <p className="text-sm text-gray-600">{formatDate(feedback.createdAt)} at {formatTime(feedback.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      feedback.priority === 'high' ? 'bg-red-100 text-red-700' :
                      feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {feedback.priority || 'Normal'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">{feedback.message || 'No feedback message'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No feedback given yet</p>
              <button
                onClick={() => navigate('/doctor/provide-feedback')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Provide Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;