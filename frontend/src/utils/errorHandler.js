// Handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request. Please check your input.';
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return data.message || 'A conflict occurred. Please try again.';
      case 422:
        return data.message || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

// Log error to console (in development)
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  }
};

// Display error notification
export const showError = (message) => {
  // You can integrate with a toast notification library here
  alert(message);
};

export default {
  handleApiError,
  logError,
  showError
};