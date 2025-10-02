// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PatientRegistration from "./components/auth/PatientRegistration";

// Health Log pages
import AddHealthLog from "./components/healthlog/AddHealthLog";
import EditHealthLog from "./components/healthlog/EditHealthLog";

// Medical History pages
import AddMedicalHistory from "./components/medicalhistory/AddMedicalHistory";
import ViewMedicalHistory from "./components/medicalhistory/ViewMedicalHistory";

// Doctor-Patient pages
import AssignDoctor from "./components/doctorpatient/AssignDoctor";
import ViewAssignments from "./components/doctorpatient/ViewAssignments";

// Other pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient-register" element={<PatientRegistration />} />

          {/* Health Logs */}
          <Route path="/healthlogs/add" element={<AddHealthLog />} />
          <Route path="/healthlogs/edit/:id" element={<EditHealthLog />} />

          {/* Medical History */}
          <Route path="/medicalhistory/add" element={<AddMedicalHistory />} />
          <Route path="/medicalhistory/view" element={<ViewMedicalHistory />} />

          {/* Doctor-Patient */}
          <Route path="/doctor/assign" element={<AssignDoctor />} />
          <Route path="/doctor/view" element={<ViewAssignments />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
