import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Filter, 
  Search, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Calendar, 
  Eye,
  ArrowLeft 
} from 'lucide-react';
import axios from 'axios';

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotificationList();
  }, [searchTerm, filterType, filterSeverity, filterRead, notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ Fixed: Use correct endpoint /api/notifications (not /all)
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data || [];
      setNotifications(data);
      setFilteredNotifications(data);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load notifications');
        // Set empty array so UI doesn't break
        setNotifications([]);
        setFilteredNotifications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterNotificationList = () => {
    let filtered = [...notifications];
    
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }
    
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(n => n.severity === filterSeverity);
    }
    
    if (filterRead === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    if (filterRead === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/notifications/${id}`, 
        { read: true },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
      
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading notifications...</p>
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
                onClick={() => navigate('/patient/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Bell className="text-white" size={24} />
                  </div>
                  <span>Notifications</span>
                </h1>
                <p className="text-gray-600 mt-1">Stay updated with your health alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
            <p className="text-gray-500 text-sm font-medium">Total</p>
            <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Unread</p>
            <p className="text-3xl font-bold text-blue-600">
              {notifications.filter(n => !n.read).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
            <p className="text-red-600 text-sm font-medium">Critical</p>
            <p className="text-3xl font-bold text-red-600">
              {notifications.filter(n => n.severity === 'critical').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
            <p className="text-green-600 text-sm font-medium">Today</p>
            <p className="text-3xl font-bold text-green-600">
              {notifications.filter(n => 
                new Date(n.timestamp || n.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Types</option>
              <option value="vital_alert">Vital Alerts</option>
              <option value="feedback">Feedback</option>
              <option value="system">System</option>
              <option value="appointment">Appointment</option>
            </select>
            
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)} 
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
            
            <select 
              value={filterRead} 
              onChange={(e) => setFilterRead(e.target.value)} 
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map(notif => (
              <div 
                key={notif._id || notif.id} 
                className={`bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg ${
                  !notif.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notif.title || 'Notification'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(notif.severity)}`}>
                        {notif.severity?.toUpperCase() || 'INFO'}
                      </span>
                      {!notif.read && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{notif.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(notif.timestamp || notif.createdAt).toLocaleString()}</span>
                      </span>
                      {notif.type && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {notif.type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {!notif.read && (
                      <button 
                        onClick={() => markAsRead(notif._id || notif.id)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif._id || notif.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bell className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {notifications.length === 0 
                ? "You don't have any notifications yet" 
                : "No notifications match your filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;