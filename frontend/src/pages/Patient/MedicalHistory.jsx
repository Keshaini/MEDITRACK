import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Plus, Search, Filter, Calendar, Trash2, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, statusFilter]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/medical`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data || []);
      setFilteredRecords(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    setFilteredRecords(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/medical/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Record deleted');
      fetchMedicalHistory();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ongoing: 'bg-blue-100 text-blue-700 border-blue-300',
      recovered: 'bg-green-100 text-green-700 border-green-300',
      chronic: 'bg-red-100 text-red-700 border-red-300',
      under_treatment: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return `px-3 py-1 rounded-full text-xs font-bold border-2 ${badges[status] || 'bg-gray-100'}`;
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      mild: 'bg-green-50 text-green-700',
      moderate: 'bg-yellow-50 text-yellow-700',
      severe: 'bg-orange-50 text-orange-700',
      critical: 'bg-red-50 text-red-700'
    };
    return `px-2 py-1 rounded text-xs font-semibold ${badges[severity] || 'bg-gray-50'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/patient/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span>Medical History</span>
                </h1>
                <p className="text-gray-600 mt-1">View and manage your medical records</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/patient/add-medical-history')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Total Records</p>
              <p className="text-3xl font-bold text-purple-900">{records.length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Ongoing</p>
              <p className="text-3xl font-bold text-blue-900">{records.filter(r => r.status === 'ongoing').length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 font-medium">Recovered</p>
              <p className="text-3xl font-bold text-green-900">{records.filter(r => r.status === 'recovered').length}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <p className="text-sm text-red-600 font-medium">Chronic</p>
              <p className="text-3xl font-bold text-red-900">{records.filter(r => r.status === 'chronic').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by condition or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="recovered">Recovered</option>
                <option value="chronic">Chronic</option>
                <option value="under_treatment">Under Treatment</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {filteredRecords.map((record) => (
                <div key={record._id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{record.condition}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{record.diagnosis}</p>
                    </div>
                    <span className={getSeverityBadge(record.severity)}>{record.severity}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(record.diagnosisDate).toLocaleDateString()}</span>
                    </div>
                    {record.doctorName && (
                      <p className="text-sm text-gray-600">👨‍⚕️ {record.doctorName}</p>
                    )}
                    {record.hospitalName && (
                      <p className="text-sm text-gray-600">🏥 {record.hospitalName}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={getStatusBadge(record.status)}>
                      {record.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { setSelectedRecord(record); setShowModal(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medical Records Found</h3>
              <p className="text-gray-600 mb-6">Start by adding your first medical record</p>
              <button
                onClick={() => navigate('/patient/add-medical-history')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg"
              >
                <Plus size={20} className="inline mr-2" />
                Add Medical Record
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Medical Record Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <div><p className="text-sm text-gray-600">Condition</p><p className="font-bold">{selectedRecord.condition}</p></div>
              <div><p className="text-sm text-gray-600">Diagnosis</p><p className="text-gray-700">{selectedRecord.diagnosis}</p></div>
              <div><p className="text-sm text-gray-600">Date</p><p className="font-semibold">{new Date(selectedRecord.diagnosisDate).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-gray-600">Status</p><span className={getStatusBadge(selectedRecord.status)}>{selectedRecord.status.replace('_', ' ')}</span></div>
              {selectedRecord.treatment && <div><p className="text-sm text-gray-600">Treatment</p><p className="text-gray-700">{selectedRecord.treatment}</p></div>}
              {selectedRecord.medication && <div><p className="text-sm text-gray-600">Medication</p><p className="text-gray-700">{selectedRecord.medication}</p></div>}
              {selectedRecord.notes && <div><p className="text-sm text-gray-600">Notes</p><p className="text-gray-700">{selectedRecord.notes}</p></div>}
            </div>
            <button onClick={() => setShowModal(false)} className="mt-6 w-full py-3 bg-purple-500 text-white font-bold rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;