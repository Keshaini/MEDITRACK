import React, { useState, useEffect } from 'react';
import { Bell, Filter, Search, Trash2, CheckCircle, AlertCircle, Activity, Calendar, Eye } from 'lucide-react';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotificationList();
  }, [searchTerm, filterType, filterSeverity, filterRead, notifications]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setFilteredNotifications(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotificationList = () => {
    let filtered = [...notifications];
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') filtered = filtered.filter(n => n.type === filterType);
    if (filterSeverity !== 'all') filtered = filtered.filter(n => n.severity === filterSeverity);
    if (filterRead === 'unread') filtered = filtered.filter(n => !n.read);
    if (filterRead === 'read') filtered = filtered.filter(n => n.read);
    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'info': 'bg-blue-100 text-blue-800 border-blue-200',
      'success': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Unread</p>
            <p className="text-3xl font-bold text-blue-600">{notifications.filter(n => !n.read).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Critical</p>
            <p className="text-3xl font-bold text-red-600">{notifications.filter(n => n.severity === 'critical').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Today</p>
            <p className="text-3xl font-bold text-green-600">
              {notifications.filter(n => new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All Types</option>
              <option value="vital_alert">Vital Alerts</option>
              <option value="feedback">Feedback</option>
              <option value="system">System</option>
            </select>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <select value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          {filteredNotifications.map(notif => (
            <div key={notif.id} className={`bg-white rounded-lg shadow p-6 ${!notif.read ? 'border-l-4 border-blue-600' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{notif.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(notif.severity)}`}>
                      {notif.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notif.message}</p>
                  <p className="text-sm text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!notif.read && (
                    <button onClick={() => markAsRead(notif.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;