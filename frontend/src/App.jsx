import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./components/common/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <h1 className="text-3xl text-center mt-10">Protected Dashboard</h1>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1 className="text-center mt-10">404 Not Found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
}
           
                  