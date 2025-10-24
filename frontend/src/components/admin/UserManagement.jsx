import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  MoreVertical,
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(roleFromUrl || 'all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActions, setShowActions] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterRole, filterStatus, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Use correct endpoint
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ✅ FIX: Handle nested data structure
      const userData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(userData);
      setFilteredUsers(userData);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.accountStatus === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/users/${userId}`, 
        { accountStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, accountStatus: newStatus } : u
      ));
      
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
      setShowActions(null);
      
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
      setShowActions(null);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const exportToPDF = () => {
    if (filteredUsers.length === 0) {
      toast.warning('No users to export');
      return;
    }

    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Add Title
      doc.setFontSize(22);
      doc.setTextColor(220, 38, 38);
      doc.text('MediTrack - User Management Report', 14, 20);

      // Add Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${currentDate}`, 14, 28);
      doc.text(`Total Users: ${filteredUsers.length}`, 14, 34);

      // Add Summary Statistics
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Summary Statistics', 14, 44);
      
      doc.setFontSize(10);
      const totalUsers = filteredUsers.length;
      const activeUsers = filteredUsers.filter(u => u.accountStatus === 'Active').length;
      const doctors = filteredUsers.filter(u => u.role === 'doctor').length;
      const patients = filteredUsers.filter(u => u.role === 'patient').length;
      const admins = filteredUsers.filter(u => u.role === 'admin').length;
      
      doc.text(`Active: ${activeUsers}`, 14, 51);
      doc.setTextColor(34, 197, 94);
      doc.text(`Doctors: ${doctors}`, 55, 51);
      doc.setTextColor(59, 130, 246);
      doc.text(`Patients: ${patients}`, 95, 51);
      doc.setTextColor(168, 85, 247);
      doc.text(`Admins: ${admins}`, 135, 51);
      
      doc.setTextColor(0);

      // Prepare table data
      const tableData = filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role?.toUpperCase() || 'N/A',
        user.accountStatus || 'N/A',
        user.phone || 'N/A',
        new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      ]);

      // Add table
      doc.autoTable({
        startY: 60,
        head: [['Name', 'Email', 'Role', 'Status', 'Phone', 'Joined']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 45 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 }
        },
        didParseCell: function(data) {
          // Color code the role column
          if (data.column.index === 2 && data.section === 'body') {
            const role = data.cell.raw.toLowerCase();
            if (role === 'doctor') {
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = 'bold';
            } else if (role === 'patient') {
              data.cell.styles.textColor = [59, 130, 246];
              data.cell.styles.fontStyle = 'bold';
            } else if (role === 'admin') {
              data.cell.styles.textColor = [168, 85, 247];
              data.cell.styles.fontStyle = 'bold';
            }
          }
          // Color code the status column
          if (data.column.index === 3 && data.section === 'body') {
            const status = data.cell.raw.toLowerCase();
            if (status === 'active') {
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'inactive') {
              data.cell.styles.textColor = [239, 68, 68];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'pending') {
              data.cell.styles.textColor = [234, 179, 8];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { top: 60, left: 14, right: 14 }
      });

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          'MediTrack Admin Portal - Confidential',
          14,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      const fileName = `MediTrack-Users-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('User report exported to PDF successfully!');

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'patient': 'bg-blue-100 text-blue-800 border-blue-300',
      'doctor': 'bg-green-100 text-green-800 border-green-300',
      'admin': 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return badges[role] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Active': 'bg-green-100 text-green-800 border-green-300',
      'Inactive': 'bg-red-100 text-red-800 border-red-300',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Locked': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600">Manage all system users and their permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.accountStatus === 'Active').length}
                </p>
              </div>
              <UserCheck className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Doctors</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'doctor').length}
                </p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Patients</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {users.filter(u => u.role === 'patient').length}
                </p>
              </div>
              <Users className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Locked">Locked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 capitalize ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(user.accountStatus)}`}>
                          {user.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        {showActions === user._id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowActions(null)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-20">
                              <button
                                onClick={() => navigate(`/admin/user/${user._id}`)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors"
                              >
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user._id, user.accountStatus)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 flex items-center space-x-3 transition-colors"
                              >
                                {user.accountStatus === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                                <span>{user.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}</span>
                              </button>
                              <button
                                onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center space-x-3 transition-colors"
                              >
                                <Edit size={16} />
                                <span>Edit User</span>
                              </button>
                              <div className="border-t border-gray-200"></div>
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="w-full text-left px-4 py-3 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-3 transition-colors rounded-b-xl"
                              >
                                <Trash2 size={16} />
                                <span>Delete User</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No users found</p>
              <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                  setFilterStatus('all');
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;