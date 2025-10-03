import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { healthLogService } from '../../services/healthLogService';
import { medicalHistoryService } from '../../services/medicalHistoryService';
import { doctorPatientService } from '../../services/doctorPatientService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Activity, FileText, Users, Plus, TrendingUp, Calendar, Heart, Droplet, Wind } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    healthLogs: 0,
    medicalHistory: 0,
    assignedDoctors: 0
  });

  const [recentHealthLogs, setRecentHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [healthLogs, medicalHistory, doctors] = await Promise.all([
        healthLogService.getHealthLogs(),
        medicalHistoryService.getMedicalHistory(),
        doctorPatientService.getAssignedDoctors(user._id).catch(() => ({ length: 0 }))
      ]);

      setStats({
        healthLogs: healthLogs.length,
        medicalHistory: medicalHistory.length,
        assignedDoctors: Array.isArray(doctors) ? doctors.length : 0
      });

      setRecentHealthLogs(healthLogs.slice(0, 3));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-primary-100 text-lg">Here's an overview of your health data</p>
          </div>
          <div className="hidden md:block text-6xl">
            🏥
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Health Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="text-blue-500" size={32} />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.healthLogs}</p>
              <p className="text-sm text-gray-500">Total Entries</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Logs</h3>
          <button
            onClick={() => navigate('/patient/health-logs')}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="text-green-500" size={32} />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.medicalHistory}</p>
              <p className="text-sm text-gray-500">Total Records</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
          <button
            onClick={() => navigate('/patient/medical-history')}
            className="text-green-500 hover:text-green-600 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>

        {/* Assigned Doctors */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-500" size={32} />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.assignedDoctors}</p>
              <p className="text-sm text-gray-500">Doctors</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assigned Doctors</h3>
          <button
            onClick={() => navigate('/patient/doctors')}
            className="text-purple-500 hover:text-purple-600 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="text-primary-500" />
          <span>Quick Actions</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/patient/health-logs/add')}
            className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 rounded-xl p-6 transition-all duration-300 border-2 border-blue-200 hover:border-blue-500 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-4 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                <Plus className="text-blue-500 group-hover:text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white">Log Health Data</h3>
              <p className="text-sm text-gray-600 group-hover:text-blue-100">Record your daily vitals</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/patient/medical-history/add')}
            className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-500 hover:to-green-600 rounded-xl p-6 transition-all duration-300 border-2 border-green-200 hover:border-green-500 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-4 rounded-full group-hover:bg-green-100 transition-colors duration-300">
                <FileText className="text-green-500 group-hover:text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white">Add Medical History</h3>
              <p className="text-sm text-gray-600 group-hover:text-green-100">Add a new medical record</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/patient/health-logs')}
            className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-500 hover:to-purple-600 rounded-xl p-6 transition-all duration-300 border-2 border-purple-200 hover:border-purple-500 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-4 rounded-full group-hover:bg-purple-100 transition-colors duration-300">
                <Activity className="text-purple-500 group-hover:text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white">View Health Logs</h3>
              <p className="text-sm text-gray-600 group-hover:text-purple-100">Check your health trends</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/patient/medical-history')}
            className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-500 hover:to-orange-600 rounded-xl p-6 transition-all duration-300 border-2 border-orange-200 hover:border-orange-500 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-4 rounded-full group-hover:bg-orange-100 transition-colors duration-300">
                <FileText className="text-orange-500 group-hover:text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white">Medical History</h3>
              <p className="text-sm text-gray-600 group-hover:text-orange-100">View all medical records</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Health Logs */}
      {recentHealthLogs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="text-primary-500" />
              <span>Recent Health Logs</span>
            </h2>
            <button
              onClick={() => navigate('/patient/health-logs')}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentHealthLogs.map((log) => (
              <div key={log._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-primary-500">
                    {format(new Date(log.date), 'MMM dd, yyyy')}
                  </span>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>

                <div className="space-y-3">
                  {log.vitals?.bloodPressure && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Droplet className="text-red-500" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-semibold text-gray-900">{log.vitals.bloodPressure} mmHg</p>
                      </div>
                    </div>
                  )}

                  {log.vitals?.heartRate && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <Heart className="text-pink-500" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="font-semibold text-gray-900">{log.vitals.heartRate} bpm</p>
                      </div>
                    </div>
                  )}

                  {log.vitals?.oxygenLevel && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Wind className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Oxygen Level</p>
                        <p className="font-semibold text-gray-900">{log.vitals.oxygenLevel}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <span>💡</span>
          <span>Health Tips</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '💧', tip: 'Drink at least 8 glasses of water daily' },
            { icon: '🏃', tip: 'Exercise for 30 minutes every day' },
            { icon: '😴', tip: 'Get 7-8 hours of sleep each night' },
            { icon: '🥗', tip: 'Eat a balanced diet with fruits and vegetables' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className="text-gray-700 font-medium">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;