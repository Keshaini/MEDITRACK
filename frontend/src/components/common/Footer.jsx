import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <p>© 2025 MediTrack. All rights reserved.</p>
      <Link to="/about" className="ml-2 text-blue-400">About</Link>
    </footer>
  );
};

export default Footer;
