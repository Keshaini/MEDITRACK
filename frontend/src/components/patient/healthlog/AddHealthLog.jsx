import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Activity,
  Heart,
  Thermometer,
  Weight,
  Droplet,
  FileText,
  Calendar,
  Clock,
  Save,
  X,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

const AddHealthLog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    // Blood Pressure validation
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

    // Heart Rate validation
    if (formData.heartRate) {
      const hr = parseInt(formData.heartRate);
      if (hr < 40 || hr > 200) {
        newErrors.heartRate = 'Heart rate should be between 40-200 bpm';
      }
    }

    // Temperature validation
    if (formData.temperature) {
      const temp = parseFloat(formData.temperature);
      if (temp < 95 || temp > 106) {
        newErrors.temperature = 'Temperature should be between 95-106°F';
      }
    }

    // Weight validation
    if (formData.weight) {
      const weight = parseFloat(formData.weight);
      if (weight < 20 || weight > 300) {
        newErrors.weight = 'Weight should be between 20-300 kg';
      }
    }

    // Blood Sugar validation
    if (formData.bloodSugar) {
      const sugar = parseInt(formData.bloodSugar);
      if (sugar < 50 || sugar > 400) {
        newErrors.bloodSugar = 'Blood sugar should be between 50-400 mg/dL';
      }
    }

    // Oxygen Saturation validation
    if (formData.oxygenSaturation) {
      const oxygen = parseInt(formData.oxygenSaturation);
      if (oxygen < 70 || oxygen > 100) {
        newErrors.oxygenSaturation = 'Oxygen saturation should be between 70-100%';
      }
    }

    // At least one vital sign required
    if (!formData.bloodPressureSystolic && !formData.heartRate && !formData.temperature && 
        !formData.weight && !formData.bloodSugar && !formData.oxygenSaturation) {
      newErrors.general = 'Please enter at least one vital sign measurement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getVitalStatus = () => {
    const warnings = [];
    
    // Check Blood Pressure
    if (formData.bloodPressureSystolic && formData.bloodPressureDiastolic) {
      const systolic = parseInt(formData.bloodPressureSystolic);
      const diastolic = parseInt(formData.bloodPressureDiastolic);
      
      if (systolic >= 140 || diastolic >= 90) {
        warnings.push('High blood pressure detected');
      } else if (systolic < 90 || diastolic < 60) {
        warnings.push('Low blood pressure detected');
      }
    }

    // Check Heart Rate
    if (formData.heartRate) {
      const hr = parseInt(formData.heartRate);
      if (hr > 100) {
        warnings.push('Elevated heart rate');
      } else if (hr < 60) {
        warnings.push('Low heart rate');
      }
    }

    // Check Temperature
    if (formData.temperature) {
      const temp = parseFloat(formData.temperature);
      if (temp >= 100.4) {
        warnings.push('Fever detected');
      } else if (temp < 97) {
        warnings.push('Low body temperature');
      }
    }

    // Check Oxygen Saturation
    if (formData.oxygenSaturation) {
      const oxygen = parseInt(formData.oxygenSaturation);
      if (oxygen < 95) {
        warnings.push('Low oxygen saturation');
      }
    }

    return warnings;
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

      // Prepare data for backend
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

      const response = await axios.post(`${API_URL}/healthlogs`, healthLogData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Health log created:', response.data);

      // Check for warnings
      const warnings = getVitalStatus();
      if (warnings.length > 0) {
        toast.warning(`Health log saved! Warnings: ${warnings.join(', ')}`, {
          autoClose: 5000
        });
      } else {
        toast.success('✅ Health log saved successfully!', {
          autoClose: 2000
        });
      }

      // Navigate back to health logs list after a short delay
      setTimeout(() => {
        navigate('/patient/health-logs');
      }, 1500);

    } catch (error) {
      console.error('❌ Error creating health log:', error);
      
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to save health log');
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Activity className="text-white" size={24} />
                </div>
                <span>Add Health Log</span>
              </h1>
              <p className="text-gray-600 mt-2">Record your daily vital signs (HL001)</p>
            </div>
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        {getVitalStatus().length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Vital Signs Alert</p>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  {getVitalStatus().map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
                <p className="text-yellow-700 text-sm mt-2">
                  Your doctor will be notified of these readings.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time Section */}
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

          {/* Vital Signs Section */}
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
                    <p className="mt-1 text-xs text-gray-500">Systolic (top number)</p>
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
                    <p className="mt-1 text-xs text-gray-500">Diastolic (bottom number)</p>
                  </div>
                </div>
                {(errors.bloodPressure || errors.bloodPressureSystolic || errors.bloodPressureDiastolic) && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.bloodPressure || errors.bloodPressureSystolic || errors.bloodPressureDiastolic}</span>
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-600">Normal range: 90/60 - 120/80 mmHg</p>
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
                <p className="mt-1 text-xs text-gray-600">Normal range: 60-100 bpm</p>
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
                <p className="mt-1 text-xs text-gray-600">Normal range: 97-99°F</p>
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
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.weight}</span>
                  </p>
                )}
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
                {errors.bloodSugar && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.bloodSugar}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-600">Fasting: 70-100 mg/dL</p>
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
                {errors.oxygenSaturation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.oxygenSaturation}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-600">Normal range: 95-100%</p>
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
                  placeholder="Describe any symptoms you're experiencing (e.g., headache, dizziness, fatigue)"
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
                  placeholder="Any additional notes or observations"
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
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Health Log</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHealthLog;