import React from 'react';

export const ProgressBar = ({ progress, className = '' }) => (
  <div className={`w-full h-1.5 bg-gray-200 rounded-full ${className}`}>
    <div 
      className="h-1.5 bg-blue-600 rounded-full transition-all duration-300" 
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;