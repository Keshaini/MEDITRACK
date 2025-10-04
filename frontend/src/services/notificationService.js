import API from './api';

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    const response = await API.get('/notifications');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await API.get('/notifications/unread-count');
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await API.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await API.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await API.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Create notification (admin/system)
  createNotification: async (notificationData) => {
    const response = await API.post('/notifications', notificationData);
    return response.data;
  },

  // Trigger alert for abnormal vitals (NF001)
  checkVitalsAlert: async (healthLogId) => {
    const response = await API.post('/notifications/vitals-alert', { healthLogId });
    return response.data;
  },

  // Notify about missed logs (NF002)
  notifyMissedLogs: async () => {
    const response = await API.post('/notifications/missed-logs');
    return response.data;
  },
};