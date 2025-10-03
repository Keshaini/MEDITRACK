// filepath: d:\SLIIT Uni\Y2S2\ITP\ITP Project - MERN\MEDITRACK\frontend\src\main.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // or your main CSS file

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);