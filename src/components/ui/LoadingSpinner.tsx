import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = '' 
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <div
        className="border-2 border-gray-200 rounded-full animate-spin border-t-blue-500"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoadingSpinner;