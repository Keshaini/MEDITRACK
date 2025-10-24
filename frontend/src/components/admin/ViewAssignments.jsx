import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link as LinkIcon, Plus, Search, Trash2, Eye, ArrowLeft, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ViewAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, statusFilter]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Use correct endpoint
      const response = await axios.get(`${API_URL}/assignments/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data || [];
      setAssignments(data);
      setFilteredAssignments(data);
      
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments([]);
      setFilteredAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];
    
    if (searchTerm) {
      filtered = filtered.filter(a => {
        const patientName = `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`.toLowerCase();
        const doctorName = `${a.doctorId?.firstName || ''} ${a.doctorId?.lastName || ''}`.toLowerCase();
        const specialization = a.doctorId?.specialization?.toLowerCase() || '';
        
        return patientName.includes(searchTerm.toLowerCase()) ||
               doctorName.includes(searchTerm.toLowerCase()) ||
               specialization.includes(searchTerm.toLowerCase());
      });
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    setFilteredAssignments(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this assignment? Patient will no longer have access to this doctor.')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Use correct endpoint
      await axios.delete(`${API_URL}/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Assignment removed successfully');
      fetchAssignments();
      
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to remove assignment');
    }
  };

  const exportToPDF = () => {
    if (filteredAssignments.length === 0) {
      toast.warning('No assignments to export');
      return;
    }

    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Title
      doc.setFontSize(22);
      doc.setTextColor(99, 102, 241);
      doc.text('MediTrack - Assignment Report', 14, 20);

      // Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${currentDate}`, 14, 28);

      // Summary
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Summary Statistics', 14, 38);
      
      doc.setFontSize(10);
      const activeCount = filteredAssignments.filter(a => a.status === 'active').length;
      const uniqueDoctors = new Set(filteredAssignments.map(a => a.doctorId?._id)).size;
      
      doc.text(`Total Assignments: ${filteredAssignments.length}`, 14, 45);
      doc.setTextColor(34, 197, 94);
      doc.text(`Active: ${activeCount}`, 70, 45);
      doc.setTextColor(59, 130, 246);
      doc.text(`Doctors: ${uniqueDoctors}`, 115, 45);
      
      doc.setTextColor(0);

      // Table data
      const tableData = filteredAssignments.map(a => [
        `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`,
        `Dr. ${a.doctorId?.firstName || ''} ${a.doctorId?.lastName || ''}`,
        a.doctorId?.specialization || 'General',
        new Date(a.assignedDate || a.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        a.status?.toUpperCase() || 'ACTIVE'
      ]);

      doc.autoTable({
        startY: 55,
        head: [['Patient', 'Doctor', 'Specialization', 'Assigned Date', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 }
        },
        didParseCell: function(data) {
          if (data.column.index === 4 && data.section === 'body') {
            const status = data.cell.raw.toLowerCase();
            if (status === 'active') {
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [156, 163, 175];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      // Footer
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
          'MediTrack Admin Portal',
          14,
          doc.internal.pageSize.height - 10
        );
      }

      const fileName = `MediTrack-Assignments-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('Assignments exported to PDF successfully!');

    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <LinkIcon className="text-white" size={24} />
                  </div>
                  <span>Doctor-Patient Assignments</span>
                </h1>
                <p className="text-gray-600 mt-1">View and manage all doctor-patient assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPDF}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => navigate('/admin/assign-doctor')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Assignment</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
              <p className="text-sm text-indigo-600 font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-indigo-900">{assignments.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-green-900">
                {assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Unique Doctors</p>
              <p className="text-3xl font-bold text-blue-900">
                {new Set(assignments.map(a => a.doctorId?._id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by patient, doctor, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredAssignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Doctor</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Specialization</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Assigned Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment, index) => (
                    <tr key={assignment._id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            {assignment.patientId?.firstName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {assignment.patientId?.firstName} {assignment.patientId?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{assignment.patientId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                            {assignment.doctorId?.firstName?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Dr. {assignment.doctorId?.firstName} {assignment.doctorId?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{assignment.doctorId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {assignment.doctorId?.specialization || 'General Practice'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(assignment.assignedDate || assignment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                          assignment.status === 'active' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}>
                          {assignment.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/assignment/${assignment._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Assignment"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first doctor-patient assignment'}
              </p>
              <button
                onClick={() => navigate('/admin/assign-doctor')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg inline-flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                <span>Create Assignment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssignments;