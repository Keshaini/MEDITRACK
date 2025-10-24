import React from "react";

const PaymentTable = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return <p className="text-center text-muted">No payments found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped align-middle">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Doctor</th>
            <th>Amount (LKR)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id || index}>
              <td>{index + 1}</td>
              <td>{payment.patientName || "N/A"}</td>
              <td>{payment.doctorName || "N/A"}</td>
              <td>{payment.amount?.toFixed(2)}</td>
              <td>
                <span
                  className={`badge ${
                    payment.status === "Completed"
                      ? "bg-success"
                      : payment.status === "Pending"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
