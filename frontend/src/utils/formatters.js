// Format date to readable string
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  if (format === 'datetime') {
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return d.toLocaleDateString();
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format blood pressure
export const formatBloodPressure = (systolic, diastolic) => {
  if (!systolic || !diastolic) return '';
  return `${systolic}/${diastolic} mmHg`;
};

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return past.toLocaleDateString();
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format name (title case)
export const formatName = (name) => {
  if (!name) return '';
  return name.split(' ').map(word => capitalize(word.toLowerCase())).join(' ');
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(decimals)}%`;
};

// Format BMI
export const formatBMI = (weight, height) => {
  if (!weight || !height) return '';
  const bmi = weight / ((height / 100) ** 2);
  return bmi.toFixed(1);
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Format vital status
export const formatVitalStatus = (value, type) => {
  // Implementation based on vital ranges from constants
  return value;
};

export default {
  formatDate,
  formatPhone,
  formatCurrency,
  formatFileSize,
  formatBloodPressure,
  formatTimeAgo,
  capitalize,
  formatName,
  truncate,
  formatPercentage,
  formatBMI,
  getBMICategory,
  formatVitalStatus
};