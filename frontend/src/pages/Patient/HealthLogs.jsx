// Main Page Wrapper
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Activity,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  Heart,
  Thermometer,
  Droplet
} from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const HealthLogs = () => {
  const navigate = useNavigate();
  const [healthLogs, setHealthLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, csetSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchHealthLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [healthLogs, searchTerm, dateFilter, statusFilter]);

  const fetchHealthLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/healthlogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const logs = response.data || [];
      setHealthLogs(logs);
      setFilteredLogs(logs);

    } catch (error) {
      console.error('Error fetching health logs:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load health logs');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...healthLogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(log.date).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.date);
        const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case '3months':
            return diffDays <= 90;
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => getVitalStatus(log) === statusFilter);
    }

    setFilteredLogs(filtered);
  };

  const getVitalStatus = (log) => {
    // Analyze vitals and return status
    const warnings = [];

    // Blood Pressure check
    if (log.bloodPressure) {
      const [systolic, diastolic] = log.bloodPressure.split('/').map(Number);
      if (systolic >= 140 || diastolic >= 90 || systolic < 90 || diastolic < 60) {
        warnings.push('bp');
      }
    }

    // Heart Rate check
    if (log.heartRate && (log.heartRate > 100 || log.heartRate < 60)) {
      warnings.push('hr');
    }

    // Temperature check
    if (log.temperature && (log.temperature >= 100.4 || log.temperature < 97)) {
      warnings.push('temp');
    }

    // Oxygen Saturation check
    if (log.oxygenSaturation && log.oxygenSaturation < 95) {
      warnings.push('oxygen');
    }

    if (warnings.length >= 2) return 'critical';
    if (warnings.length === 1) return 'warning';
    return 'normal';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 border-2 border-red-300 rounded-full text-xs font-bold flex items-center space-x-1">
            <span>🚨</span>
            <span>Critical</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 border-2 border-yellow-300 rounded-full text-xs font-bold flex items-center space-x-1">
            <span>⚠️</span>
            <span>Warning</span>
          </span>
        );
      case 'normal':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-green-300 rounded-full text-xs font-bold flex items-center space-x-1">
            <span>✅</span>
            <span>Normal</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-full text-xs font-bold">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  const handleDelete = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this health log? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/healthlogs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Health log deleted successfully');
      fetchHealthLogs(); // Refresh list

    } catch (error) {
      console.error('Error deleting health log:', error);
      toast.error('Failed to delete health log');
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const exportToPDF = () => {
    if (filteredLogs.length === 0) {
      toast.warning('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Add Title
      doc.setFontSize(20);
      doc.setTextColor(31, 78, 121);
      doc.text('MediTrack - Health Logs Report', 14, 20);

      // Add Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${currentDate}`, 14, 28);

      // Add Summary Statistics
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Summary Statistics', 14, 38);
      
      doc.setFontSize(10);
      const normalCount = filteredLogs.filter(log => getVitalStatus(log) === 'normal').length;
      const warningCount = filteredLogs.filter(log => getVitalStatus(log) === 'warning').length;
      const criticalCount = filteredLogs.filter(log => getVitalStatus(log) === 'critical').length;
      
      doc.text(`Total Logs: ${filteredLogs.length}`, 14, 45);
      doc.setTextColor(34, 197, 94);
      doc.text(`Normal: ${normalCount}`, 60, 45);
      doc.setTextColor(234, 179, 8);
      doc.text(`Warning: ${warningCount}`, 95, 45);
      doc.setTextColor(239, 68, 68);
      doc.text(`Critical: ${criticalCount}`, 135, 45);
      
      doc.setTextColor(0);

      // Prepare table data
      const tableData = filteredLogs.map(log => [
        formatDate(log.date),
        formatTime(log.time) || '-',
        log.bloodPressure || 'N/A',
        log.heartRate ? `${log.heartRate} bpm` : 'N/A',
        log.temperature ? `${log.temperature}°F` : 'N/A',
        log.weight ? `${log.weight} kg` : 'N/A',
        log.bloodSugar ? `${log.bloodSugar} mg/dL` : 'N/A',
        log.oxygenSaturation ? `${log.oxygenSaturation}%` : 'N/A',
        getVitalStatus(log).toUpperCase()
      ]);

      // Add table
      autoTable(doc, {
        startY: 55,
        head: [['Date', 'Time', 'BP', 'Heart Rate', 'Temp', 'Weight', 'Blood Sugar', 'Oxygen', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [31, 78, 121],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 15 },
          2: { cellWidth: 18 },
          3: { cellWidth: 22 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
          6: { cellWidth: 22 },
          7: { cellWidth: 18 },
          8: { cellWidth: 18 }
        },
        didParseCell: function(data) {
          // Color code the status column
          if (data.column.index === 8 && data.section === 'body') {
            const status = data.cell.raw.toLowerCase();
            if (status === 'normal') {
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'warning') {
              data.cell.styles.textColor = [234, 179, 8];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'critical') {
              data.cell.styles.textColor = [239, 68, 68];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { top: 55, left: 14, right: 14 }
      });

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          'MediTrack - Your Health Companion',
          14,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      const fileName = `MediTrack-HealthLogs-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('Health logs exported to PDF successfully!');

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading health logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Activity className="text-white" size={24} />
                  </div>
                  <span>My Health Logs</span>
                </h1>
                <p className="text-gray-600 mt-1">Track and manage your daily vital signs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
              <button
                onClick={() => navigate('/patient/add-health-log')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Health Log</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Logs</p>
              <p className="text-3xl font-bold text-blue-900">{healthLogs.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium">Normal</p>
              <p className="text-3xl font-bold text-green-900">
                {healthLogs.filter(log => getVitalStatus(log) === 'normal').length}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <p className="text-sm text-yellow-600 font-medium">Warning</p>
              <p className="text-3xl font-bold text-yellow-900">
                {healthLogs.filter(log => getVitalStatus(log) === 'warning').length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <p className="text-sm text-red-600 font-medium">Critical</p>
              <p className="text-3xl font-bold text-red-900">
                {healthLogs.filter(log => getVitalStatus(log) === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by symptoms, notes, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Active Filters Info */}
          {(searchTerm || dateFilter !== 'all' || statusFilter !== 'all') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredLogs.length} of {healthLogs.length} logs
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setStatusFilter('all');
                }}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Health Logs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Blood Pressure</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Heart Rate</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Temperature</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Weight</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr
                      key={log._id || index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{formatDate(log.date)}</p>
                          {log.time && (
                            <p className="text-sm text-gray-500">{formatTime(log.time)}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Heart size={16} className="text-red-500" />
                          <span className="text-gray-900">{log.bloodPressure || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Activity size={16} className="text-blue-500" />
                          <span className="text-gray-900">{log.heartRate ? `${log.heartRate} bpm` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Thermometer size={16} className="text-orange-500" />
                          <span className="text-gray-900">{log.temperature ? `${log.temperature}°F` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Droplet size={16} className="text-purple-500" />
                          <span className="text-gray-900">{log.weight ? `${log.weight} kg` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(getVitalStatus(log))}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/patient/edit-health-log/${log._id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Health Logs Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || dateFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : "You haven't added any health logs yet"}
              </p>
              <button
                onClick={() => navigate('/patient/add-health-log')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Your First Health Log</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Health Log Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedLog.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{formatTime(selectedLog.time) || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Vital Signs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center space-x-2">
                        <Heart size={16} />
                        <span>Blood Pressure</span>
                      </p>
                      <p className="font-bold text-gray-900">{selectedLog.bloodPressure || 'N/A'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 flex items-center space-x-2">
                        <Activity size={16} />
                        <span>Heart Rate</span>
                      </p>
                      <p className="font-bold text-gray-900">{selectedLog.heartRate ? `${selectedLog.heartRate} bpm` : 'N/A'}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-600 flex items-center space-x-2">
                        <Thermometer size={16} />
                        <span>Temperature</span>
                      </p>
                      <p className="font-bold text-gray-900">{selectedLog.temperature ? `${selectedLog.temperature}°F` : 'N/A'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-600">Weight</p>
                      <p className="font-bold text-gray-900">{selectedLog.weight ? `${selectedLog.weight} kg` : 'N/A'}</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-sm text-pink-600">Blood Sugar</p>
                      <p className="font-bold text-gray-900">{selectedLog.bloodSugar ? `${selectedLog.bloodSugar} mg/dL` : 'N/A'}</p>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-sm text-teal-600">Oxygen Saturation</p>
                      <p className="font-bold text-gray-900">{selectedLog.oxygenSaturation ? `${selectedLog.oxygenSaturation}%` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {selectedLog.symptoms && (
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h3 className="font-bold text-gray-900 mb-2">Symptoms</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLog.symptoms}</p>
                  </div>
                )}

                {selectedLog.notes && (
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLog.notes}</p>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-2">Status</h3>
                  {getStatusBadge(getVitalStatus(selectedLog))}
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate(`/patient/edit-health-log/${selectedLog._id}`);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Log
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
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

export default HealthLogs;