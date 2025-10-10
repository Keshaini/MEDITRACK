import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const loaderSize = sizeClasses[size] || sizeClasses.medium;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${loaderSize} text-blue-600 animate-spin mx-auto mb-4`} />
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${loaderSize} text-blue-600 animate-spin mb-3`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

// Inline loader for buttons
export const ButtonLoader = ({ className = '' }) => (
  <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
);

// Spinner only (no text)
export const Spinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  return (
    <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin ${className}`} />
  );
};

export default Loader;