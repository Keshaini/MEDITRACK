import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentTable from "../../components/common/PaymentTable";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/payments`);
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold text-primary">💳 Payment Management</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <PaymentTable payments={payments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
