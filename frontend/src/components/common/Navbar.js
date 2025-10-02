// src/components/common/Navbar.js
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#1976d2", color: "white" }}>
      <Link to="/" style={{ marginRight: "15px", color: "white" }}>Home</Link>
      <Link to="/login" style={{ marginRight: "15px", color: "white" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "15px", color: "white" }}>Register</Link>
      <Link to="/healthlogs/add" style={{ marginRight: "15px", color: "white" }}>Add Health Log</Link>
      <Link to="/medicalhistory/add" style={{ marginRight: "15px", color: "white" }}>Add Medical History</Link>
      <Link to="/doctor/assign" style={{ marginRight: "15px", color: "white" }}>Assign Doctor</Link>
    </nav>
  );
}

export default Navbar;
