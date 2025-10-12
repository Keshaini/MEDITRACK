import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const [redirected, setRedirected] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page with toast only once
  if (!user) {
    if (!redirected) {
      toast.error('Please login to access this page');
      setRedirected(true);
    }
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (!redirected) {
      toast.error('You do not have permission to access this page');
      setRedirected(true);
    }

    switch(user.role) {
      case 'patient':
        return <Navigate to="/patient/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
