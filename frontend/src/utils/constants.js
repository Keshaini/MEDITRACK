// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_TIMEOUT = 30000;

// Application Info
export const APP_NAME = 'MediTrack';
export const APP_VERSION = '1.0.0';

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

// Health Log Status
export const VITAL_STATUS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Vital Ranges
export const VITAL_RANGES = {
  bloodPressure: {
    systolic: { low: 90, normal: 120, high: 140 },
    diastolic: { low: 60, normal: 80, high: 90 }
  },
  heartRate: { low: 60, normal: 80, high: 100 },
  bloodSugar: {
    fasting: { low: 70, normal: 100, high: 126 },
    postMeal: { low: 70, normal: 140, high: 180 }
  },
  temperature: { low: 36.1, normal: 37.0, high: 37.2 },
  weight: { min: 30, max: 300 }
};

// Notification Types
export const NOTIFICATION_TYPES = {
  VITAL_ALERT: 'vital_alert',
  FEEDBACK: 'feedback',
  SYSTEM: 'system',
  APPOINTMENT: 'appointment'
};

// Notification Severity
export const NOTIFICATION_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success'
};

// Medical Record Types
export const MEDICAL_RECORD_TYPES = {
  CONSULTATION: 'consultation',
  LAB_REPORT: 'lab_report',
  PRESCRIPTION: 'prescription',
  IMAGING: 'imaging',
  SURGERY: 'surgery',
  CHECKUP: 'checkup',
  OTHER: 'other'
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm'
};

// Status Colors
export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-blue-100 text-blue-800'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Session Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Feedback Types
export const FEEDBACK_TYPES = {
  GENERAL: 'general',
  IMPROVEMENT: 'improvement',
  CONCERN: 'concern',
  ALERT: 'alert'
};

// Doctor Specializations
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery'
];

// Common Symptoms
export const COMMON_SYMPTOMS = [
  'Fever',
  'Headache',
  'Cough',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Chest Pain',
  'Shortness of Breath',
  'Abdominal Pain',
  'Joint Pain'
];

// Time Intervals
export const TIME_INTERVALS = {
  NOTIFICATION_POLL: 30000, // 30 seconds
  SESSION_CHECK: 60000, // 1 minute
  AUTO_SAVE: 5000 // 5 seconds
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  BLOOD_PRESSURE: /^\d{2,3}\/\d{2,3}$/
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_VERSION,
  USER_ROLES,
  ROUTES,
  VITAL_STATUS,
  VITAL_RANGES,
  NOTIFICATION_TYPES,
  NOTIFICATION_SEVERITY,
  MEDICAL_RECORD_TYPES,
  FILE_UPLOAD,
  PAGINATION,
  DATE_FORMATS,
  STATUS_COLORS,
  PRIORITY_LEVELS,
  STORAGE_KEYS,
  FEEDBACK_TYPES,
  SPECIALIZATIONS,
  COMMON_SYMPTOMS,
  TIME_INTERVALS,
  REGEX_PATTERNS
};