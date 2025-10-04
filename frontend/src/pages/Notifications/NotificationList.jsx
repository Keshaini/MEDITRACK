import React, { useState, useEffect } from 'react';
import { Bell, Filter, Trash2, CheckCheck } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, VITAL_ALERT, MISSED_LOG, etc.

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, typeFilter, notifications]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Apply read/unread filter
    if (filter === 'UNREAD') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'READ') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationService.deleteNotification(notificationId);
        setNotifications(notifications.filter(n => n._id !== notificationId));
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      VITAL_ALERT: '⚠️',
      MISSED_LOG: '📅',
      DOCTOR_FEEDBACK: '👨‍⚕️',
      SYSTEM: '🔔',
      REMINDER: '⏰',
    };
    return icons[type] || '🔔';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your health alerts and reminders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-700">Filters:</span>
          </div>

          {/* Read/Unread Filter */}
          <div className="flex space-x-2">
            {['ALL', 'UNREAD', 'READ'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="VITAL_ALERT">Vital Alerts</option>
            <option value="MISSED_LOG">Missed Logs</option>
            <option value="DOCTOR_FEEDBACK">Doctor Feedback</option>
            <option value="REMINDER">Reminders</option>
            <option value="SYSTEM">System</option>
          </select>

          {/* Mark All as Read */}
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="ml-auto flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              <CheckCheck size={18} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Bell size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg ${
                !notification.isRead ? 'border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg ${!notification.isRead ? 'font-bold' : 'font-semibold'} text-gray-900`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </span>

                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="px-3 py-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="px-3 py-1 text-sm text-red-500 hover:text-red-600 font-medium flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;