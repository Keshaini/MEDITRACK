import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Users,
  FileText
} from 'lucide-react';

const Payments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Payment data - will be populated from backend
  const [payments, setPayments] = useState([]);

  // Calculate statistics
  const stats = {
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    completedCount: payments.filter(p => p.status === 'completed').length,
    failedCount: payments.filter(p => p.status === 'failed').length
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleDownloadInvoice = (payment) => {
    toast.success(`Downloading invoice ${payment.invoiceNumber}`);
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = ['Payment ID', 'Patient Name', 'Patient ID', 'Doctor Name', 'Amount', 'Date', 'Time', 'Status', 'Method', 'Transaction ID', 'Description', 'Invoice Number'];
    
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.patientName,
      payment.patientId,
      payment.doctorName,
      `${payment.amount.toFixed(2)}`,
      payment.date,
      payment.time,
      payment.status,
      payment.method,
      payment.transactionId,
      payment.description,
      payment.invoiceNumber
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `payment_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Payment report exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <DollarSign className="text-white" size={24} />
                  </div>
                  <span>Payment Management</span>
                </h1>
                <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.pendingAmount.toFixed(2)}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">Processing</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedCount}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Successful</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.failedCount}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingDown size={16} className="text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Requires Action</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by patient, doctor, payment ID, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-600" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none font-medium"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Payment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{payment.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.patientName}</p>
                          <p className="text-sm text-gray-500">{payment.patientId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{payment.doctorName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">${payment.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.date}</p>
                            <p className="text-xs text-gray-500">{payment.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <CreditCard size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{payment.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(payment)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <FileText size={48} className="text-gray-300" />
                        <p className="text-gray-500 font-medium">No payments found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FileText size={24} />
                <span>Payment Details</span>
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusIcon(selectedPayment.status)}
                  <span className="capitalize">{selectedPayment.status}</span>
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${selectedPayment.amount.toFixed(2)}
                </span>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment ID</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.invoiceNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.transactionId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.method}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Patient & Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.patientName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Patient ID</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.patientId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Doctor Name</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.doctorName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Service Description</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.description}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment Date</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment Time</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.time}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => handleDownloadInvoice(selectedPayment)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Download size={18} />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;