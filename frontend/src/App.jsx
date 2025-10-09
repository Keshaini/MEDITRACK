import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/common/PrivateRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import TermsOfService from "./pages/Auth/TermsOfService";
import PrivacyPolicy from "./pages/Auth/PrivacyPolicy";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Uncomment these as you create them:
// Patient Components
// import HealthLogList from "./pages/patient/HealthLogs";
import AddHealthLog from "./components/patient/healthlog/AddHealthLog";
// import EditHealthLog from "./components/patient/healthlog/EditHealthLog";
// import ViewMedicalHistory from "./pages/patient/MedicalHistory";
// import AddMedicalHistory from "./components/patient/medicalhistory/AddMedicalHistory";
// import MyDoctors from "./pages/patient/MyDoctors";
// import PatientProfile from "./pages/patient/Profile";

// Doctor Components
// import PatientList from "./pages/doctor/PatientList";
// import PatientDetails from "./pages/doctor/PatientDetails";
// import ProvideFeedback from "./pages/doctor/ProvideFeedback";
// import FeedbackHistory from "./pages/doctor/FeedbackHistory";

// Admin Components
// import Users from "./pages/admin/Users";
// import Assignments from "./pages/admin/Assignments";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* ============================================ */}
            {/* PUBLIC ROUTES */}
            {/* ============================================ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* ============================================ */}
            {/* PATIENT ROUTES (Protected) */}
            {/* ============================================ */}
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />

            {/* Uncomment as you create these pages: */}
            {/*
            <Route
              path="/patient/health-logs"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <HealthLogList />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/add-health-log"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <AddHealthLog />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/edit-health-log/:id"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <EditHealthLog />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/medical-history"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <ViewMedicalHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/add-medical-history"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <AddMedicalHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/my-doctors"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <MyDoctors />
                </PrivateRoute>
              }
            />

            <Route
              path="/patient/profile"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientProfile />
                </PrivateRoute>
              }
            />
            */}

            {/* ============================================ */}
            {/* DOCTOR ROUTES (Protected) - Sprint 2 */}
            {/* ============================================ */}
            <Route
              path="/doctor/dashboard"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />

            {/* Uncomment as you create these pages: */}
            {/*
            <Route
              path="/doctor/patients"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <PatientList />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/patient/:id"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <PatientDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/provide-feedback"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <ProvideFeedback />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/feedback-history"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <FeedbackHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/profile"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorProfile />
                </PrivateRoute>
              }
            />
            */}

            {/* ============================================ */}
            {/* ADMIN ROUTES (Protected) */}
            {/* ============================================ */}
            {/*
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Users />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/assignments"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Assignments />
                </PrivateRoute>
              }
            />
            */}

            {/* ============================================ */}
            {/* 404 NOT FOUND */}
            {/* ============================================ */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                    <a
                      href="/"
                      className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* Toast Notifications Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}