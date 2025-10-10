import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, Activity, MessageSquare, Eye, Filter } from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  useEffect(() => {
    filterPatientList();
  }, [searchTerm, filterStatus, patients]);

  const fetchAssignedPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatientList = () => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(patient => patient.status === filterStatus);
    }

    setFilteredPatients(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'attention': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'stable': 'bg-green-100 text-green-800 border-green-200',
      'monitoring': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskBadge = (riskLevel) => {
    const badges = {
      'high': 'bg-red-500 text-white',
      'medium': 'bg-yellow-500 text-white',
      'low': 'bg-green-500 text-white'
    };
    return badges[riskLevel] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">Monitor and manage your assigned patients</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <User className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-600">
                  {patients.filter(p => p.status === 'critical').length}
                </p>
              </div>
              <Activity className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Need Attention</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {patients.filter(p => p.status === 'attention').length}
                </p>
              </div>
              <MessageSquare className="h-10 w-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Stable</p>
                <p className="text-3xl font-bold text-green-600">
                  {patients.filter(p => p.status === 'stable').length}
                </p>
              </div>
              <Activity className="h-10 w-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="critical">Critical</option>
                <option value="attention">Need Attention</option>
                <option value="stable">Stable</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You have no assigned patients yet'}
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-blue-100 rounded-full p-3">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(patient.riskLevel)}`}>
                            {patient.riskLevel} risk
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Patient ID:</span> {patient.patientId}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {patient.email}
                          </div>
                          <div>
                            <span className="font-medium">Age:</span> {patient.age} years
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Last BP</p>
                            <p className="text-sm font-semibold text-gray-900">{patient.lastVitals?.bloodPressure || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                            <p className="text-sm font-semibold text-gray-900">{patient.lastVitals?.heartRate || 'N/A'} bpm</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Blood Sugar</p>
                            <p className="text-sm font-semibold text-gray-900">{patient.lastVitals?.bloodSugar || 'N/A'} mg/dL</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Last Check</p>
                            <p className="text-sm font-semibold text-gray-900">{patient.lastCheckIn || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Assigned: {new Date(patient.assignedDate).toLocaleDateString()}
                          </span>
                          {patient.conditions && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                Conditions: {patient.conditions.join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.location.href = `/doctor/patient/${patient.id}/logs`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Logs</span>
                      </button>
                      <button
                        onClick={() => window.location.href = `/doctor/patient/${patient.id}/feedback`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Feedback</span>
                      </button>
                    </div>
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

export default PatientList;