import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { registerUser } from "../../services/authService";

import { User, Mail, Lock, Phone, Calendar, MapPin, Droplet, AlertCircle, Eye, EyeOff, UserPlus, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    role: 'patient', // Default role
    specialization: '', // For doctors
    licenseNumber: '' // For doctors
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number for Sri Lanka
    if (name === 'phone' || name === 'emergencyContact') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateSriLankanPhone = (phone) => {
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validateSriLankanPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Sri Lankan phone number (e.g., 0771234567)';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old to register';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    // Doctor-specific validations
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required for doctors';
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'Medical license number is required for doctors';
      }
    }

    // Patient-specific validations - REQUIRED FIELDS
    if (formData.role === 'patient') {
      // Blood Group validation - NOW REQUIRED
      if (!formData.bloodGroup) {
        newErrors.bloodGroup = 'Blood group is required';
      }

      // Address validation - NOW REQUIRED
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      } else if (formData.address.trim().length < 10) {
        newErrors.address = 'Please enter a complete address (minimum 10 characters)';
      }

      // Emergency Contact validation - NOW REQUIRED
      if (!formData.emergencyContact.trim()) {
        newErrors.emergencyContact = 'Emergency contact number is required';
      } else if (!validateSriLankanPhone(formData.emergencyContact)) {
        newErrors.emergencyContact = 'Please enter a valid Sri Lankan phone number';
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

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      // Remove doctor-specific fields if not a doctor
      if (dataToSend.role !== 'doctor') {
        delete dataToSend.specialization;
        delete dataToSend.licenseNumber;
      }
      
      // Call register from AuthContext
      await register(dataToSend);
      
      // SUCCESS - Show success toast
      toast.success(
        'Account created successfully! Please login to continue.',
        { autoClose: 3000 }
      );
      
      // Wait a moment for toast to show, then navigate after 1.0 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      // ERROR HANDLING - Show specific error messages
      console.error('Registration error:', error);
      
      if (error.response) {
        // Backend responded with error
        const errorMessage = error.response.data.message || 'Registration failed';
        toast.error(errorMessage);
        
        // Handle specific error codes
        if (error.response.status === 400) {
          toast.error('Invalid data provided. Please check your inputs.');
        } else if (error.response.status === 409) {
          toast.error('Email already exists. Please use a different email.');
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later.');
        }
      } else if (error.request) {
        // Request made but no response (backend not running)
        toast.error('Cannot connect to server. Please ensure the backend is running.');
      } else {
        // Something else went wrong
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      patient: '👤',
      doctor: '👨‍⚕️',
      admin: '👑'
    };
    return icons[role] || '👤';
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      patient: 'Track your health logs, medical history, and connect with doctors',
      doctor: 'Provide medical feedback and monitor patient health records',
      admin: 'Manage system users, doctors, and patient assignments'
    };
    return descriptions[role] || '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4 animate-pulse">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join Meditrack and start managing your health today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection - FIRST */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border-2 border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="text-primary-500" size={20} />
              <span>Select Your Role <span className="text-red-500">*</span></span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Patient Role */}
              <button
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  role: formData.role === 'patient' ? '' : 'patient',
                  specialization: formData.role === 'doctor' ? '' : formData.specialization,
                  licenseNumber: formData.role === 'doctor' ? '' : formData.licenseNumber
                })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.role === 'patient'
                    ? 'border-primary-500 bg-white shadow-lg ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-primary-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{getRoleIcon('patient')}</div>
                  <h4 className="font-bold text-gray-900 mb-1">Patient</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {getRoleDescription('patient')}
                  </p>
                  {formData.role === 'patient' && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Doctor Role */}
              <button
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  role: formData.role === 'doctor' ? '' : 'doctor',
                  specialization: formData.role === 'doctor' ? '' : formData.specialization,
                  licenseNumber: formData.role === 'doctor' ? '' : formData.licenseNumber
                })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.role === 'doctor'
                    ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{getRoleIcon('doctor')}</div>
                  <h4 className="font-bold text-gray-900 mb-1">Doctor</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {getRoleDescription('doctor')}
                  </p>
                  {formData.role === 'doctor' && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Admin Role */}
              <button
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  role: formData.role === 'admin' ? '' : 'admin',
                  specialization: formData.role === 'doctor' ? '' : formData.specialization,
                  licenseNumber: formData.role === 'doctor' ? '' : formData.licenseNumber
                })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  formData.role === 'admin'
                    ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-200'
                    : 'border-gray-300 hover:border-red-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{getRoleIcon('admin')}</div>
                  <h4 className="font-bold text-gray-900 mb-1">Admin</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {getRoleDescription('admin')}
                  </p>
                  {formData.role === 'admin' && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Current Selection Display */}
            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Current Selection:</span>
                  {formData.role ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getRoleIcon(formData.role)}</span>
                      <span className="font-bold text-gray-900 capitalize">{formData.role}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No role selected</span>
                  )}
                </div>
                {formData.role && (
                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      role: '',
                      specialization: '',
                      licenseNumber: ''
                    })}
                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center space-x-1 hover:underline"
                  >
                    <span>✕</span>
                    <span>Clear Selection</span>
                  </button>
                )}
              </div>
            </div>

            {/* Helper Text */}
            <p className="mt-3 text-xs text-gray-500 text-center">
              Click on a role card to select or deselect it
            </p>

            {errors.role && (
              <p className="mt-3 text-sm text-red-600 flex items-center justify-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.role}</span>
              </p>
            )}
          </div>
          
          {/* Doctor-Specific Fields */}
          {formData.role === 'doctor' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="text-blue-500" size={20} />
                <span>Doctor Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none ${
                      errors.specialization ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Cardiologist, General Physician"
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.specialization}</span>
                    </p>
                  )}
                </div>

                {/* Medical License Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Enter your license number"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.licenseNumber}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b-2 border-primary-500 pb-2">
              <User className="text-primary-500" size={20} />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b-2 border-primary-500 pb-2">
              <Mail className="text-primary-500" size={20} />
              <span>Contact Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="0771234567"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Format: 07XXXXXXXX (10 digits)</p>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b-2 border-primary-500 pb-2">
              <Lock className="text-primary-500" size={20} />
              <span>Account Security</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                      errors.password ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must contain uppercase, lowercase & number</p>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b-2 border-primary-500 pb-2">
              <Calendar className="text-primary-500" size={20} />
              <span>Personal Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.dateOfBirth}</span>
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                    errors.gender ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.gender}</span>
                  </p>
                )}
              </div>

              {/* Blood Group - NOW REQUIRED for Patients */}
              {formData.role === 'patient' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                      errors.bloodGroup ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.bloodGroup}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information - NOW REQUIRED for Patients */}
          {formData.role === 'patient' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b-2 border-primary-500 pb-2">
                <MapPin className="text-primary-500" size={20} />
                <span>Additional Information <span className="text-red-500">*</span></span>
              </h3>
              
              <div className="space-y-4">
                {/* Address - NOW REQUIRED */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter your full address (Street, City, Province)"
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">Minimum 10 characters required</p>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                {/* Emergency Contact - NOW REQUIRED */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 transition-all duration-300 outline-none ${
                        errors.emergencyContact ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="0771234567"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Format: 07XXXXXXXX (10 digits)</p>
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.emergencyContact}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              By clicking "Sign Up", you agree to Meditrack's{' '}
              <Link to="/terms" className="text-primary-500 hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={24} />
                <span>Sign Up as {formData.role === 'patient' ? 'Patient' : formData.role === 'doctor' ? 'Doctor' : formData.role === 'admin' ? 'Admin' : 'User'}</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t-2 border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-500 hover:text-primary-600 transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;