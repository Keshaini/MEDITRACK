import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, Key, AlertCircle, Check, Bell, LogOut, Trash2 } from 'lucide-react';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    securityAlerts: true,
    sessionTimeout: 30
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSecuritySettings();
    fetchActiveSessions();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/security/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/security/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/security/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        setSettings(newSettings);
        setSuccess('Settings updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update settings');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    updateSettings(newSettings);
  };

  const handleSessionTimeoutChange = (e) => {
    const newSettings = { ...settings, sessionTimeout: parseInt(e.target.value) };
    updateSettings(newSettings);
  };

  const terminateSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/security/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setSuccess('Session terminated');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to terminate session');
    }
  };

  const terminateAllSessions = async () => {
    if (!window.confirm('This will log you out from all devices except this one. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/security/sessions/terminate-all', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchActiveSessions();
        setSuccess('All other sessions terminated');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to terminate sessions');
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
          <p className="text-gray-600">Manage your account security and privacy preferences</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Authentication</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  </div>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => window.location.href = '/security/2fa'}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.twoFactorEnabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {settings.twoFactorEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Change Password</h3>
                  </div>
                  <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
                </div>
                <button
                  onClick={() => window.location.href = '/security/change-password'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Key className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Session Timeout</h3>
                  </div>
                  <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                </div>
                <select
                  value={settings.sessionTimeout}
                  onChange={handleSessionTimeoutChange}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <span>Notifications</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Login Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                </div>
                <button
                  onClick={() => handleToggle('loginNotifications')}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.loginNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Security Alerts</h3>
                  <p className="text-sm text-gray-600">Receive alerts about unusual account activity</p>
                </div>
                <button
                  onClick={() => handleToggle('securityAlerts')}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.securityAlerts ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <LogOut className="h-6 w-6 text-blue-600" />
                <span>Active Sessions</span>
              </h2>
              {sessions.length > 1 && (
                <button
                  onClick={terminateAllSessions}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Terminate All Others
                </button>
              )}
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{session.device}</h3>
                      {session.current && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{session.browser}</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/settings/delete-account'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;