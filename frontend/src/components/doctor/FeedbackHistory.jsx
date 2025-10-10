import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, User, Filter, Search, Download, Eye, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const FeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  useEffect(() => {
    filterFeedbackList();
  }, [searchTerm, filterType, filterPriority, dateRange, feedbacks]);

  const fetchFeedbackHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/feedback/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
        setFilteredFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching feedback history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbackList = () => {
    let filtered = [...feedbacks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(fb =>
        fb.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(fb => fb.type === filterType);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(fb => fb.priority === filterPriority);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(fb => {
        const fbDate = new Date(fb.date);
        const daysDiff = Math.floor((now - fbDate) / (1000 * 60 * 60 * 24));
        
        switch(dateRange) {
          case 'today':
            return daysDiff === 0;
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredFeedbacks(filtered);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'normal': 'bg-blue-100 text-blue-800 border-blue-200',
      'low': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'concern':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'improvement': 'bg-green-50 border-green-200',
      'concern': 'bg-yellow-50 border-yellow-200',
      'alert': 'bg-red-50 border-red-200',
      'general': 'bg-blue-50 border-blue-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Patient', 'Type', 'Priority', 'Feedback', 'Vitals Context'];
    const rows = filteredFeedbacks.map(fb => [
      new Date(fb.date).toLocaleDateString(),
      fb.patientName,
      fb.type,
      fb.priority,
      fb.feedback,
      fb.vitalsContext || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback History</h1>
            <p className="text-gray-600">Review all feedback provided to patients</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900">{feedbacks.length}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-3xl font-bold text-green-600">
                  {feedbacks.filter(fb => {
                    const daysDiff = Math.floor((new Date() - new Date(fb.date)) / (1000 * 60 * 60 * 24));
                    return daysDiff <= 7;
                  }).length}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Urgent</p>
                <p className="text-3xl font-bold text-red-600">
                  {feedbacks.filter(fb => fb.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Patients</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(feedbacks.map(fb => fb.patientId)).size}
                </p>
              </div>
              <User className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="improvement">Improvement</option>
              <option value="concern">Concern</option>
              <option value="alert">Alert</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You have not provided any feedback yet'}
              </p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 ${getTypeColor(feedback.type)}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-gray-100 rounded-full p-3">
                        {getTypeIcon(feedback.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{feedback.patientName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(feedback.priority)}`}>
                            {feedback.priority}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {feedback.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(feedback.date).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Patient ID: {feedback.patientId}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <p className="text-gray-800 leading-relaxed">{feedback.feedback}</p>
                        </div>

                        {feedback.vitalsContext && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-medium text-blue-900 mb-1">Vitals Context:</p>
                            <p className="text-sm text-blue-800">{feedback.vitalsContext}</p>
                          </div>
                        )}

                        {feedback.recommendations && feedback.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {feedback.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-600">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.followUpDate && (
                          <div className="mt-3 flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700">
                              Follow-up scheduled: {new Date(feedback.followUpDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = `/doctor/patient/${feedback.patientId}/logs`}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Patient</span>
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

export default FeedbackHistory;