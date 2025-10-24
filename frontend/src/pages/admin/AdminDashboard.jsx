import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  Settings,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalPatients: 0,
      totalDoctors: 0,
      activeAssignments: 0,
      pendingVerifications: 0
    },
    recentUsers: [],
    recentAssignments: [],
    systemActivity: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // ✅ FIX: Use correct endpoints
      const [usersRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/users`, {  // Changed from /admin/users
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/assignments/all`, {  // Changed from /admin/assignments
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
      const assignments = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : (assignmentsRes.data?.data || []);
      
      // Calculate stats
      const patients = users.filter(u => u.role === 'patient');
      const doctors = users.filter(u => u.role === 'doctor');
      const activeAssignments = assignments.filter(a => a.status === 'active');
      const pendingDoctors = doctors.filter(d => d.accountStatus === 'Inactive');

      setDashboardData({
        stats: {
          totalUsers: users.length,
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          activeAssignments: activeAssignments.length,
          pendingVerifications: pendingDoctors.length
        },
        recentUsers: users.slice(0, 10),
        recentAssignments: assignments.slice(0, 5),
        systemActivity: []
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

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'patient': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'doctor': return 'bg-green-100 text-green-700 border-green-300';
      case 'admin': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'patient': return '👤';
      case 'doctor': return '👨‍⚕️';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="flex items-center space-x-1 text-green-700"><CheckCircle size={14} /><span>Active</span></span>;
      case 'Inactive':
        return <span className="flex items-center space-x-1 text-yellow-700"><Clock size={14} /><span>Inactive</span></span>;
      case 'Locked':
        return <span className="flex items-center space-x-1 text-red-700"><XCircle size={14} /><span>Locked</span></span>;
      default:
        return <span className="text-gray-700">{status}</span>;
    }
  };

  const filteredUsers = dashboardData.recentUsers.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading admin dashboard...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MediTrack</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
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
        <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome, Admin {user?.firstName || ''}! 👑
              </h2>
              <p className="text-red-100 mb-2">
                System Administrator Dashboard
              </p>
              <p className="text-red-200 text-sm flex items-center space-x-2">
                <Clock size={16} />
                <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Patients</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalPatients}</p>
            <button
              onClick={() => navigate('/admin/users?role=patient')}
              className="mt-2 text-blue-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Total Doctors */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="text-green-600" size={24} />
              </div>
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Doctors</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalDoctors}</p>
            <button
              onClick={() => navigate('/admin/users?role=doctor')}
              className="mt-2 text-green-500 text-sm font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Active Assignments */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <LinkIcon className="text-indigo-600" size={24} />
              </div>
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Assignments</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.activeAssignments}</p>
            <button
              onClick={() => navigate('/admin/assignments')}
              className="mt-2 text-indigo-500 text-sm font-medium hover:underline"
            >
              Manage →
            </button>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.pendingVerifications}</p>
            <button
              onClick={() => navigate('/admin/verifications')}
              className="mt-2 text-yellow-600 text-sm font-medium hover:underline"
            >
              Review →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="text-red-500" size={24} />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Users className="text-blue-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Manage Users</span>
            </button>

            <button
              onClick={() => navigate('/admin/assign-doctor')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <LinkIcon className="text-green-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">Assign Doctor</span>
            </button>

            <button
              onClick={() => navigate('/admin/assignments')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Eye className="text-purple-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">View Assignments</span>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Settings className="text-orange-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-gray-700">System Settings</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="text-blue-500" size={24} />
              <span>Recent Users</span>
            </h3>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-blue-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center space-x-1 w-fit ${getRoleBadgeColor(user.role)}`}>
                          <span>{getRoleIcon(user.role)}</span>
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(user.accountStatus)}</td>
                      <td className="py-3 px-4 text-gray-700">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/user/${user._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                toast.success('User deleted successfully (demo)');
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No users found</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <LinkIcon className="text-green-500" size={24} />
              <span>Recent Doctor-Patient Assignments</span>
            </h3>
            <button
              onClick={() => navigate('/admin/assignments')}
              className="text-green-500 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {dashboardData.recentAssignments.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">👤</span>
                        <div>
                          <p className="font-semibold text-gray-900">{assignment.patientName || 'Patient'}</p>
                          <p className="text-sm text-gray-600">Patient</p>
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">👨‍⚕️</span>
                        <div>
                          <p className="font-semibold text-gray-900">{assignment.doctorName || 'Doctor'}</p>
                          <p className="text-sm text-gray-600">{assignment.specialization || 'Specialist'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(assignment.assignedDate)}</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <LinkIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No assignments yet</p>
              <button
                onClick={() => navigate('/admin/assign-doctor')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;