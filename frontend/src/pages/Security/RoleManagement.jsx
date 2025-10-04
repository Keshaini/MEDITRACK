import React, { useState, useEffect } from 'react';
import { Shield, Users, Lock, Check, X, Plus, Edit, Trash2, Search } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { toast } from 'react-toastify';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState(['patient', 'doctor', 'admin', 'staff']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applySearch();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const data = await securityService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setActionLoading(true);
    try {
      await securityService.assignRole(selectedUser._id, selectedRole);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === selectedUser._id ? { ...u, role: selectedRole } : u
      ));
      
      toast.success('Role assigned successfully!');
      setShowModal(false);
      setSelectedUser(null);
      setSelectedRole('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign role');
    } finally {
      setActionLoading(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || '');
    setShowModal(true);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800 border-red-300',
      doctor: 'bg-blue-100 text-blue-800 border-blue-300',
      patient: 'bg-green-100 text-green-800 border-green-300',
      staff: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return badges[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: '👑',
      doctor: '👨‍⚕️',
      patient: '👤',
      staff: '👔',
    };
    return icons[role?.toLowerCase()] || '👤';
  };

  const getPermissionsList = (role) => {
    const permissions = {
      admin: ['Full System Access', 'User Management', 'Role Assignment', 'System Configuration', 'View All Data'],
      doctor: ['View Patient Records', 'Provide Feedback', 'View Assignments', 'Update Medical Records'],
      patient: ['View Own Records', 'Add Health Logs', 'Add Medical History', 'View Feedback'],
      staff: ['View Patient Data', 'Update Appointments', 'Manage Documents'],
    };
    return permissions[role?.toLowerCase()] || [];
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <Shield className="text-primary-500" size={36} />
          <span>Role-Based Access Control</span>
        </h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {roles.map(role => {
          const count = users.filter(u => u.role?.toLowerCase() === role.toLowerCase()).length;
          return (
            <div key={role} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">{role}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
                <div className="text-4xl">{getRoleIcon(role)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Current Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Permissions</th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 rounded-full p-2">
                          <span className="text-2xl">{getRoleIcon(user.role)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{user.email}</p>
                      {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${getRoleBadge(user.role)}`}>
                        {user.role?.toUpperCase() || 'NO ROLE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getPermissionsList(user.role).slice(0, 2).map((perm, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {perm}
                          </span>
                        ))}
                        {getPermissionsList(user.role).length > 2 && (
                          <span className="text-xs text-primary-500 font-semibold px-2 py-1">
                            +{getPermissionsList(user.role).length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openRoleModal(user)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 text-sm font-medium"
                      >
                        <Edit size={16} />
                        <span>Change Role</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Shield size={24} />
                <span>Assign Role</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {selectedUser.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Current Role:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role?.toUpperCase() || 'NO ROLE'}
                  </span>
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select New Role *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === role
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{getRoleIcon(role)}</span>
                        {selectedRole === role && (
                          <Check className="text-primary-500" size={24} />
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 uppercase text-left">{role}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Preview */}
              {selectedRole && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Role Permissions:</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {getPermissionsList(selectedRole).map((perm, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          <span>{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-800">Warning</p>
                    <p className="text-sm text-yellow-700">
                      Changing user roles will immediately affect their access permissions. 
                      Make sure you understand the implications before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRole}
                disabled={actionLoading || !selectedRole}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Assign Role</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;