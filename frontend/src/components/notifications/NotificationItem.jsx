import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info, X, Activity, Heart, Droplet } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }) => {
  const getSeverityIcon = (severity, type) => {
    if (type === 'vital_alert') {
      return <Activity className="h-5 w-5 text-red-600" />;
    }
    
    switch(severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'bg-red-50 border-red-200',
      'warning': 'bg-yellow-50 border-yellow-200',
      'info': 'bg-blue-50 border-blue-200',
      'success': 'bg-green-50 border-green-200'
    };
    return colors[severity] || 'bg-gray-50 border-gray-200';
  };

  const getVitalIcon = (vitalType) => {
    switch(vitalType) {
      case 'blood_pressure':
        return <Heart className="h-4 w-4" />;
      case 'blood_sugar':
        return <Droplet className="h-4 w-4" />;
      case 'heart_rate':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifTime.toLocaleDateString();
  };

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
        !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      } ${getSeverityColor(notification.severity)}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-2 rounded-full bg-white">
          {getSeverityIcon(notification.severity, notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
              {notification.title}
            </h4>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>

          {notification.vitalDetails && (
            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
              <div className="flex items-center space-x-1">
                {getVitalIcon(notification.vitalDetails.type)}
                <span className="font-medium">{notification.vitalDetails.value}</span>
              </div>
              {notification.vitalDetails.normalRange && (
                <span>Normal: {notification.vitalDetails.normalRange}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {getTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;