import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  Pill,
  AlertCircle,
  Save,
  X,
  ArrowLeft,
  Upload
} from 'lucide-react';
import axios from 'axios';

const AddMedicalHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    diagnosis: '',
    diagnosisDate: '',
    treatment: '',
    medication: '',
    doctorName: '',
    hospitalName: '',
    notes: '',
    status: 'ongoing',
    severity: 'moderate'
  });
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition/Disease name is required';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }

    if (!formData.diagnosisDate) {
      newErrors.diagnosisDate = 'Diagnosis date is required';
    } else {
      const diagnosisDate = new Date(formData.diagnosisDate);
      const today = new Date();
      if (diagnosisDate > today) {
        newErrors.diagnosisDate = 'Diagnosis date cannot be in the future';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const medicalData = {
        condition: formData.condition,
        diagnosis: formData.diagnosis,
        diagnosisDate: formData.diagnosisDate,
        treatment: formData.treatment || '',
        medication: formData.medication || '',
        doctorName: formData.doctorName || '',
        hospitalName: formData.hospitalName || '',
        notes: formData.notes || '',
        status: formData.status,
        severity: formData.severity
      };

      const response = await axios.post(`${API_URL}/medical`, medicalData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Medical history created:', response.data);

      toast.success('✅ Medical record added successfully!', {
        autoClose: 2000
      });

      setTimeout(() => {
        navigate('/patient/medical-history');
      }, 1500);

    } catch (error) {
      console.error('❌ Error creating medical history:', error);
      
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to add medical record');
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span>Add Medical History</span>
                </h1>
                <p className="text-gray-600 mt-2">Record your medical conditions and diagnoses</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Stethoscope className="text-purple-500" size={20} />
              <span>Medical Condition Details</span>
            </h2>

            <div className="space-y-4">
              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition/Disease Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="e.g., Hypertension, Diabetes, Asthma"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-200 transition-all outline-none ${
                    errors.condition ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.condition}</span>
                  </p>
                )}
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Detailed diagnosis description"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none ${
                    errors.diagnosis ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
                  }`}
                ></textarea>
                {errors.diagnosis && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.diagnosis}</span>
                  </p>
                )}
              </div>

              {/* Diagnosis Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosis Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="diagnosisDate"
                  value={formData.diagnosisDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-200 transition-all outline-none ${
                    errors.diagnosisDate ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.diagnosisDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.diagnosisDate}</span>
                  </p>
                )}
              </div>

              {/* Status & Severity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="recovered">Recovered</option>
                    <option value="chronic">Chronic</option>
                    <option value="under_treatment">Under Treatment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Pill className="text-green-500" size={20} />
              <span>Treatment & Medication</span>
            </h2>

            <div className="space-y-4">
              {/* Treatment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the treatment plan"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                ></textarea>
              </div>

              {/* Medication */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medication <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="medication"
                  value={formData.medication}
                  onChange={handleChange}
                  rows="3"
                  placeholder="List medications and dosages"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Doctor & Hospital Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="text-blue-500" size={20} />
              <span>Healthcare Provider</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Doctor Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital/Clinic Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g., City General Hospital"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="text-indigo-500" size={20} />
              <span>Additional Notes</span>
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional information, symptoms, or observations"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">📋 Important Information</p>
                <p>This medical history will be accessible to your assigned doctor. Make sure to provide accurate and complete information for better healthcare management.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Medical Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicalHistory;