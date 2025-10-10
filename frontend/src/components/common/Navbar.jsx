import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Bell, Menu, X, LogOut, User, Home, Activity, FileText, Users, Shield } from 'lucide-react';
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <span className="text-2xl">🏥</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Meditrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === 'patient' && (
                  <>
                    <Link
                      to="/patient/dashboard"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Home size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/patient/health-logs"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Activity size={18} />
                      <span>Health Logs</span>
                    </Link>
                    <Link
                      to="/patient/medical-history"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <FileText size={18} />
                      <span>Medical History</span>
                    </Link>
                  </>
                )}

                {user.role === 'doctor' && (
                  <>
                    <Link
                      to="/doctor/feedback"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
                    >
                      Provide Feedback
                    </Link>
                    <Link
                      to="/doctor/feedback-history"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
                    >
                      Feedback History
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/assignments"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Users size={18} />
                      <span>Assignments</span>
                    </Link>
                    <Link
                      to="/admin/assign-doctor"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200"
                    >
                      Assign Doctor
                    </Link>
                    <Link
                      to="/admin/role-management"
                      className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Shield size={18} />
                      <span>Roles</span>
                    </Link>
                  </>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700">{user.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                          {user.role?.toUpperCase()}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/security/mfa"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Shield size={18} />
                        <span>Security (MFA)</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {!user ? (
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {user.role === 'patient' && (
                  <>
                    <Link
                      to="/patient/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/patient/health-logs"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Health Logs
                    </Link>
                    <Link
                      to="/patient/medical-history"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Medical History
                    </Link>
                  </>
                )}
                <Link
                  to="/notifications"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;