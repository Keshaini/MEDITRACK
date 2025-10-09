import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Activity,
  Heart,
  Thermometer,
  Weight,
  Droplet,
  FileText,
  Calendar,
  Save,
  X,
  AlertCircle,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

const EditHealthLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    weight: '',
    bloodSugar: '',
    oxygenSaturation: '',
    symptoms: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchHealthLog();
  }, [id]);

  const fetchHealthLog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/healthlogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const log = response.data;

      // Parse blood pressure
      let systolic = '';
      let diastolic = '';
      if (log.bloodPressure) {
        [systolic, diastolic] = log.bloodPressure.split('/');
      }

      setFormData({
        date: log.date ? new Date(log.date).toISOString().split('T')[0] : '',
        time: log.time || '',
        bloodPressureSystolic: systolic,
        bloodPressureDiastolic: diastolic,
        heartRate: log.heartRate || '',
        temperature: log.temperature || '',
        weight: log.weight || '',
        bloodSugar: log.bloodSugar || '',
        oxygenSaturation: log.oxygenSaturation || '',
        symptoms: log.symptoms || '',
        notes: log.notes || ''
      });

    } catch (error) {
      console.error('Error fetching health log:', error);
      toast.error('Failed to load health log');
      navigate('/patient/health-logs');
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.bloodPressureSystolic || formData.bloodPressureDiastolic) {
      const systolic = parseInt(formData.bloodPressureSystolic);
      const diastolic = parseInt(formData.bloodPressureDiastolic);

      if (!formData.bloodPressureSystolic || !formData.bloodPressureDiastolic) {
        newErrors.bloodPressure = 'Both systolic and diastolic values are required';
      } else if (systolic < 70 || systolic > 200) {
        newErrors.bloodPressureSystolic = 'Systolic should be between 70-200 mmHg';
      } else if (diastolic < 40 || diastolic > 130) {
        newErrors.bloodPressureDiastolic = 'Diastolic should be between 40-130 mmHg';
      } else if (systolic <= diastolic) {
        newErrors.bloodPressure = 'Systolic must be greater than diastolic';
      }
    }

    if (formData.heartRate) {
      const hr = parseInt(formData.heartRate);
      if (hr < 40 || hr > 200) {
        newErrors.heartRate = 'Heart rate should be between 40-200 bpm';
      }
    }

    if (formData.temperature) {
      const temp = parseFloat(formData.temperature);
      if (temp < 95 || temp > 106) {
        newErrors.temperature = 'Temperature should be between 95-106°F';
      }
    }

    if (formData.weight) {
      const weight = parseFloat(formData.weight);
      if (weight < 20 || weight > 300) {
        newErrors.weight = 'Weight should be between 20-300 kg';
      }
    }

    if (formData.bloodSugar) {
      const sugar = parseInt(formData.bloodSugar);
      if (sugar < 50 || sugar > 400) {
        newErrors.bloodSugar = 'Blood sugar should be between 50-400 mg/dL';
      }
    }

    if (formData.oxygenSaturation) {
      const oxygen = parseInt(formData.oxygenSaturation);
      if (oxygen < 70 || oxygen > 100) {
        newErrors.oxygenSaturation = 'Oxygen saturation should be between 70-100%';
      }
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

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      const healthLogData = {
        date: formData.date,
        time: formData.time,
        bloodPressure: formData.bloodPressureSystolic && formData.bloodPressureDiastolic 
          ? `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}`
          : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bloodSugar: formData.bloodSugar ? parseInt(formData.bloodSugar) : null,
        oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null,
        symptoms: formData.symptoms || '',
        notes: formData.notes || ''
      };

      await axios.put(`${API_URL}/healthlogs/${id}`, healthLogData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Health log updated successfully!');
      setTimeout(() => {
        navigate('/patient/health-logs');
      }, 1000);

    } catch (error) {
      console.error('Error updating health log:', error);
      toast.error(error.response?.data?.message || 'Failed to update health log');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/patient/health-logs');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading health log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patient/health-logs')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Activity className="text-white" size={24} />
                  </div>
                  <span>Edit Health Log</span>
                </h1>
                <p className="text-gray-600 mt-2">Update your vital signs (HL002)</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="text-blue-500" size={20} />
              <span>Date & Time</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.date ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vital Signs - Same as AddHealthLog */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={20} />
              <span>Vital Signs</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Pressure */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Heart className="text-red-500" size={18} />
                  <span>Blood Pressure (mmHg)</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleChange}
                      placeholder="Systolic (e.g., 120)"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                        errors.bloodPressureSystolic || errors.bloodPressure ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <p className="mt-1 text-xs text-gray-500">Systolic</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleChange}
                      placeholder="Diastolic (e.g., 80)"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                        errors.bloodPressureDiastolic || errors.bloodPressure ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <p className="mt-1 text-xs text-gray-500">Diastolic</p>
                  </div>
                </div>
                {(errors.bloodPressure || errors.bloodPressureSystolic || errors.bloodPressureDiastolic) && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.bloodPressure || errors.bloodPressureSystolic || errors.bloodPressureDiastolic}</span>
                  </p>
                )}
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Activity className="text-blue-500" size={18} />
                  <span>Heart Rate (bpm)</span>
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="e.g., 72"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.heartRate ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.heartRate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.heartRate}</span>
                  </p>
                )}
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Thermometer className="text-orange-500" size={18} />
                  <span>Temperature (°F)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="e.g., 98.6"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.temperature ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.temperature && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.temperature}</span>
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Weight className="text-purple-500" size={18} />
                  <span>Weight (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 70.5"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.weight ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Blood Sugar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Droplet className="text-red-500" size={18} />
                  <span>Blood Sugar (mg/dL)</span>
                </label>
                <input
                  type="number"
                  name="bloodSugar"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  placeholder="e.g., 95"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.bloodSugar ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Oxygen Saturation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                  <Activity className="text-teal-500" size={18} />
                  <span>Oxygen Saturation (%)</span>
                </label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  placeholder="e.g., 98"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.oxygenSaturation ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Symptoms & Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="text-indigo-500" size={20} />
              <span>Additional Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Symptoms <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe any symptoms"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional notes"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Health Log</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHealthLog;