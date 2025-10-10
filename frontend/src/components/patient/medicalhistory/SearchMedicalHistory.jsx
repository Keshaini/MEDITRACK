import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, FileText, Download, Eye, X, SlidersHorizontal } from 'lucide-react';

const SearchMedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    recordType: 'all',
    dateFrom: '',
    dateTo: '',
    category: 'all',
    sortBy: 'date_desc'
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, records]);

  const fetchMedicalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/medical-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setFilteredRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.recordType !== 'all') {
      filtered = filtered.filter(r => r.type === filters.recordType);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(r => new Date(r.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(r => new Date(r.date) <= new Date(filters.dateTo));
    }

    switch(filters.sortBy) {
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredRecords(filtered);
  };

  const resetFilters = () => {
    setFilters({
      recordType: 'all',
      dateFrom: '',
      dateTo: '',
      category: 'all',
      sortBy: 'date_desc'
    });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Title', 'Diagnosis', 'Treatment', 'Doctor'];
    const rows = filteredRecords.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.type,
      r.title,
      r.diagnosis,
      r.treatment || 'N/A',
      r.doctorName || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getTypeColor = (type) => {
    const colors = {
      'consultation': 'bg-blue-100 text-blue-800',
      'lab_report': 'bg-purple-100 text-purple-800',
      'prescription': 'bg-green-100 text-green-800',
      'imaging': 'bg-orange-100 text-orange-800',
      'surgery': 'bg-red-100 text-red-800',
      'checkup': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Medical History</h1>
            <p className="text-gray-600">Find and filter your medical records</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, diagnosis, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={filters.recordType}
                  onChange={(e) => setFilters({...filters, recordType: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="consultation">Consultation</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="imaging">Imaging</option>
                  <option value="surgery">Surgery</option>
                  <option value="checkup">Checkup</option>
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="neurology">Neurology</option>
                  <option value="general">General</option>
                  <option value="pediatrics">Pediatrics</option>
                </select>

                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  placeholder="From Date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  placeholder="To Date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredRecords.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{records.length}</span> records
          </p>
        </div>

        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">
                {searchTerm || filters.recordType !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo
                  ? 'Try adjusting your search or filters'
                  : 'No medical records available'}
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{record.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                        {record.priority === 'high' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            High Priority
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Doctor</p>
                          <p className="text-sm font-medium text-gray-900">{record.doctorName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="text-sm font-medium text-gray-900">{record.category || 'General'}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis:</p>
                        <p className="text-sm text-gray-900">{record.diagnosis}</p>
                      </div>

                      {record.treatment && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">Treatment:</p>
                          <p className="text-sm text-blue-800">{record.treatment}</p>
                        </div>
                      )}

                      {record.medications && record.medications.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                          <div className="flex flex-wrap gap-2">
                            {record.medications.map((med, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.attachments && record.attachments.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {record.attachments.map((file, idx) => (
                              <button
                                key={idx}
                                onClick={() => window.open(file.url, '_blank')}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                              >
                                <FileText className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-700">{file.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => window.location.href = `/patient/medical-history/${record.id}`}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMedicalHistory;