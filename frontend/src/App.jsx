// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth Pages
import Home from "./pages/Home";  
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import TermsOfService from './pages/Auth/TermsOfService';
import PrivacyPolicy from './pages/Auth/PrivacyPolicy';

// Patient Components
import PatientDashboard from './pages/patient/PatientDashboard';
import AddHealthLog from './components/patient/healthlog/AddHealthLog';
import EditHealthLog from './components/patient/healthlog/EditHealthLog';
import HealthLogList from './components/patient/healthlog/HealthLogList';
import AddMedicalHistory from './components/patient/medicalhistory/AddMedicalHistory';
import ViewMedicalHistory from './components/patient/medicalhistory/ViewMedicalHistory';
import AttachLabReports from './components/patient/medicalhistory/AttachLabReports';
import SearchMedicalHistory from './components/patient/medicalhistory/SearchMedicalHistory';

// Doctor Components
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientList from './components/doctor/PatientList';
import ProvideFeedback from './components/doctor/ProvideFeedback';
import FeedbackHistory from './components/doctor/FeedbackHistory';

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import DoctorVerification from './components/admin/DoctorVerification';
import ViewAssignments from './components/admin/ViewAssignments';

// Notifications
import NotificationList from './components/notifications/NotificationList';

// Security
import TwoFactorAuth from './components/security/TwoFactorAuth';
import ChangePassword from './components/security/ChangePassword';
import SecuritySettings from './components/security/SecuritySettings';

// Fallback
import NotFound from './pages/NotFound'; 

// ✅ Layout component
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/forgot-password', '/reset-password'].some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            
            {/* ✅ ToastContainer added globally */}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={<PrivateRoute allowedRoles={['patient']}><PatientDashboard /></PrivateRoute>} />
                <Route path="/patient/health-logs" element={<PrivateRoute allowedRoles={['patient']}><HealthLogList /></PrivateRoute>} />
                <Route path="/patient/health-logs/add" element={<PrivateRoute allowedRoles={['patient']}><AddHealthLog /></PrivateRoute>} />
                <Route path="/patient/health-logs/edit/:id" element={<PrivateRoute allowedRoles={['patient']}><EditHealthLog /></PrivateRoute>} />
                <Route path="/patient/medical-history" element={<PrivateRoute allowedRoles={['patient']}><ViewMedicalHistory /></PrivateRoute>} />
                <Route path="/patient/medical-history/add" element={<PrivateRoute allowedRoles={['patient']}><AddMedicalHistory /></PrivateRoute>} />
                <Route path="/patient/medical-history/upload" element={<PrivateRoute allowedRoles={['patient']}><AttachLabReports /></PrivateRoute>} />
                <Route path="/patient/medical-history/search" element={<PrivateRoute allowedRoles={['patient']}><SearchMedicalHistory /></PrivateRoute>} />

                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={<PrivateRoute allowedRoles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
                <Route path="/doctor/patients" element={<PrivateRoute allowedRoles={['doctor']}><PatientList /></PrivateRoute>} />
                <Route path="/doctor/feedback" element={<PrivateRoute allowedRoles={['doctor']}><ProvideFeedback /></PrivateRoute>} />
                <Route path="/doctor/feedback/history" element={<PrivateRoute allowedRoles={['doctor']}><FeedbackHistory /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>} />
                <Route path="/admin/doctors" element={<PrivateRoute allowedRoles={['admin']}><DoctorVerification /></PrivateRoute>} />
                <Route path="/admin/assignments" element={<PrivateRoute allowedRoles={['admin']}><ViewAssignments /></PrivateRoute>} />

                {/* Notifications */}
                <Route path="/notifications" element={<PrivateRoute allowedRoles={['patient','doctor','admin']}><NotificationList /></PrivateRoute>} />

                {/* Security */}
                <Route path="/security/2fa" element={<PrivateRoute allowedRoles={['patient','doctor','admin']}><TwoFactorAuth /></PrivateRoute>} />
                <Route path="/security/change-password" element={<PrivateRoute allowedRoles={['patient','doctor','admin']}><ChangePassword /></PrivateRoute>} />
                <Route path="/security/settings" element={<PrivateRoute allowedRoles={['patient','doctor','admin']}><SecuritySettings /></PrivateRoute>} />

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
