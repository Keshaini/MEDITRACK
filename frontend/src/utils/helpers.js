import { VITAL_RANGES } from './constants';

// Get vital status based on value
export const getVitalStatus = (value, type) => {
  if (!value || !type) return 'normal';
  
  const ranges = VITAL_RANGES[type];
  if (!ranges) return 'normal';
  
  if (type === 'bloodPressure') {
    const [systolic] = value.split('/').map(Number);
    if (systolic < ranges.systolic.low) return 'low';
    if (systolic > ranges.systolic.high) return 'high';
    if (systolic > ranges.systolic.normal + 20) return 'critical';
    return 'normal';
  }
  
  const numValue = Number(value);
  if (numValue < ranges.low) return 'low';
  if (numValue > ranges.high) return 'high';
  if (type === 'heartRate' && numValue > ranges.high + 20) return 'critical';
  if (type === 'bloodSugar' && numValue > ranges.high + 50) return 'critical';
  
  return 'normal';
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Sort array by property
export const sortBy = (array, property, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

// Group array by property
export const groupBy = (array, property) => {
  return array.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, properties) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    properties.some(prop =>
      item[prop]?.toString().toLowerCase().includes(term)
    )
  );
};

// Download file
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// Get color for status
export const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    inactive: 'red',
    pending: 'yellow',
    verified: 'blue',
    critical: 'red',
    warning: 'yellow',
    normal: 'green',
    low: 'blue',
    high: 'orange'
  };
  return colors[status] || 'gray';
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default {
  getVitalStatus,
  calculateAge,
  debounce,
  deepClone,
  isEmpty,
  generateId,
  sortBy,
  groupBy,
  filterBySearch,
  downloadFile,
  copyToClipboard,
  getInitials,
  isToday,
  getStatusColor,
  storage
};