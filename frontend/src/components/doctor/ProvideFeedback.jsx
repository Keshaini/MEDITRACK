import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageSquare, Send, ArrowLeft, User, Calendar, Activity, AlertCircle, Save } from 'lucide-react';
import axios from 'axios';

const ProvideFeedback = () => {
  const navigate = useNavigate();
  const { patientId, logId } = useParams();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    priority: 'normal',
    recommendations: ''
  });
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchHealthLogs(selectedPatient._id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/doctor/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    }
  };

  const fetchHealthLogs = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/doctor/patient/${patientId}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHealthLogs(response.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedPatient) newErrors.patient = 'Please select a patient';
    if (!selectedLog) newErrors.log = 'Please select a health log';
    if (!formData.message.trim()) newErrors.message = 'Feedback message is required';
    if (formData.message.trim().length < 10) newErrors.message = 'Feedback must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/doctor/feedback`, {
        patientId: selectedPatient._id,
        healthLogId: selectedLog._id,
        message: formData.message,
        priority: formData.priority,
        recommendations: formData.recommendations
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Feedback provided successfully!');
      setTimeout(() => navigate('/doctor/dashboard'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/doctor/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <span>Provide Feedback</span>
              </h1>
              <p className="text-gray-600 mt-1">Give medical feedback on patient health logs</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Patient */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <User className="text-blue-500" size={20} />
              <span>Select Patient <span className="text-red-500">*</span></span>
            </h2>
            <select
              value={selectedPatient?._id || ''}
              onChange={(e) => {
                const patient = patients.find(p => p._id === e.target.value);
                setSelectedPatient(patient);
                setSelectedLog(null);
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg outline-none ${
                errors.patient ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.firstName} {p.lastName} - {p.email}</option>
              ))}
            </select>
            {errors.patient && <p className="mt-2 text-sm text-red-600 flex items-center space-x-1"><AlertCircle size={14} /><span>{errors.patient}</span></p>}
          </div>

          {/* Select Health Log */}
          {selectedPatient && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Activity className="text-green-500" size={20} />
                <span>Select Health Log <span className="text-red-500">*</span></span>
              </h2>
              {healthLogs.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {healthLogs.map(log => (
                    <div
                      key={log._id}
                      onClick={() => setSelectedLog(log)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedLog?._id === log._id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{new Date(log.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">BP: {log.bloodPressure || 'N/A'} | HR: {log.heartRate || 'N/A'} bpm</p>
                        </div>
                        {selectedLog?._id === log._id && <span className="text-green-600 font-bold">✓ Selected</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No health logs available for this patient</p>
              )}
              {errors.log && <p className="mt-2 text-sm text-red-600 flex items-center space-x-1"><AlertCircle size={14} /><span>{errors.log}</span></p>}
            </div>
          )}

          {/* Feedback Form */}
          {selectedLog && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Feedback Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Feedback Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Provide your medical feedback and observations..."
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                      }`}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600 flex items-center space-x-1"><AlertCircle size={14} /><span>{errors.message}</span></p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recommendations <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any recommendations or action items..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/doctor/dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProvideFeedback;