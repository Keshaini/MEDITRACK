import API from './api';

export const securityService = {
  // Role-Based Access Control (RBAC)
  getAllRoles: async () => {
    const response = await API.get('/security/roles');
    return response.data;
  },

  getUserRoles: async (userId) => {
    const response = await API.get(`/security/users/${userId}/roles`);
    return response.data;
  },

  assignRole: async (userId, role) => {
    const response = await API.post('/security/assign-role', { userId, role });
    return response.data;
  },

  removeRole: async (userId, role) => {
    const response = await API.post('/security/remove-role', { userId, role });
    return response.data;
  },

  updateUserPermissions: async (userId, permissions) => {
    const response = await API.put(`/security/users/${userId}/permissions`, { permissions });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await API.get('/security/users');
    return response.data;
  },

  // Multi-Factor Authentication (MFA)
  enableMFA: async () => {
    const response = await API.post('/security/mfa/enable');
    return response.data;
  },

  verifyMFASetup: async (token) => {
    const response = await API.post('/security/mfa/verify-setup', { token });
    return response.data;
  },

  disableMFA: async (password) => {
    const response = await API.post('/security/mfa/disable', { password });
    return response.data;
  },

  verifyMFALogin: async (token) => {
    const response = await API.post('/security/mfa/verify-login', { token });
    return response.data;
  },

  getMFAStatus: async () => {
    const response = await API.get('/security/mfa/status');
    return response.data;
  },

  generateBackupCodes: async () => {
    const response = await API.post('/security/mfa/backup-codes');
    return response.data;
  },

  // Security Logs
  getSecurityLogs: async (filters = {}) => {
    const response = await API.get('/security/logs', { params: filters });
    return response.data;
  },

  // Password Management
  changePassword: async (currentPassword, newPassword) => {
    const response = await API.post('/security/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  },
};