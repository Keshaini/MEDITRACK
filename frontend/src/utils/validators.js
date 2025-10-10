import { REGEX_PATTERNS, VITAL_RANGES, FILE_UPLOAD } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' };
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true, message: '' };
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return { valid: false, message: 'Invalid phone number format' };
  }
  return { valid: true, message: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  if (!/[@$!%*?&]/.test(password)) {
    return { valid: false, message: 'Password must contain special character' };
  }
  return { valid: true, message: '' };
};

// Blood Pressure validation
export const validateBloodPressure = (bp) => {
  if (!bp) return { valid: false, message: 'Blood pressure is required' };
  if (!REGEX_PATTERNS.BLOOD_PRESSURE.test(bp)) {
    return { valid: false, message: 'Invalid format. Use: 120/80' };
  }
  const [systolic, diastolic] = bp.split('/').map(Number);
  if (systolic < 60 || systolic > 250) {
    return { valid: false, message: 'Systolic value out of range (60-250)' };
  }
  if (diastolic < 40 || diastolic > 150) {
    return { valid: false, message: 'Diastolic value out of range (40-150)' };
  }
  return { valid: true, message: '' };
};

// Heart Rate validation
export const validateHeartRate = (hr) => {
  if (!hr) return { valid: false, message: 'Heart rate is required' };
  const rate = Number(hr);
  if (isNaN(rate)) {
    return { valid: false, message: 'Heart rate must be a number' };
  }
  if (rate < 30 || rate > 250) {
    return { valid: false, message: 'Heart rate out of range (30-250)' };
  }
  return { valid: true, message: '' };
};

// Blood Sugar validation
export const validateBloodSugar = (bs) => {
  if (!bs) return { valid: false, message: 'Blood sugar is required' };
  const sugar = Number(bs);
  if (isNaN(sugar)) {
    return { valid: false, message: 'Blood sugar must be a number' };
  }
  if (sugar < 20 || sugar > 600) {
    return { valid: false, message: 'Blood sugar out of range (20-600)' };
  }
  return { valid: true, message: '' };
};

// Temperature validation
export const validateTemperature = (temp) => {
  if (!temp) return { valid: false, message: 'Temperature is required' };
  const temperature = Number(temp);
  if (isNaN(temperature)) {
    return { valid: false, message: 'Temperature must be a number' };
  }
  if (temperature < 32 || temperature > 45) {
    return { valid: false, message: 'Temperature out of range (32-45°C)' };
  }
  return { valid: true, message: '' };
};

// Weight validation
export const validateWeight = (weight) => {
  if (!weight) return { valid: false, message: 'Weight is required' };
  const w = Number(weight);
  if (isNaN(w)) {
    return { valid: false, message: 'Weight must be a number' };
  }
  if (w < 1 || w > 500) {
    return { valid: false, message: 'Weight out of range (1-500 kg)' };
  }
  return { valid: true, message: '' };
};

// File validation
export const validateFile = (file) => {
  if (!file) return { valid: false, message: 'File is required' };
  
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, message: 'Invalid file type. Only PDF, JPG, PNG allowed' };
  }
  
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return { valid: false, message: `File size exceeds ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB` };
  }
  
  return { valid: true, message: '' };
};

// Date validation
export const validateDate = (date) => {
  if (!date) return { valid: false, message: 'Date is required' };
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, message: 'Invalid date format' };
  }
  if (dateObj > new Date()) {
    return { valid: false, message: 'Date cannot be in the future' };
  }
  return { valid: true, message: '' };
};

// Name validation
export const validateName = (name) => {
  if (!name) return { valid: false, message: 'Name is required' };
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: 'Name must be less than 100 characters' };
  }
  return { valid: true, message: '' };
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

// Form validation helper
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach(key => {
    const { value, validator, fieldName } = fields[key];
    const result = validator(value, fieldName);
    if (!result.valid) {
      errors[key] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateBloodPressure,
  validateHeartRate,
  validateBloodSugar,
  validateTemperature,
  validateWeight,
  validateFile,
  validateDate,
  validateName,
  validateRequired,
  validateForm
};