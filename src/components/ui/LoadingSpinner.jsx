import React from 'react';
import { FiLoader } from 'react-icons/fi';

// Unified spinner that matches the Vendor dashboard style (FiLoader icon)
const LoadingSpinner = ({ size = 24, className = '' }) => {
  // size can be a number (px) or tailwind size classes via className
  const style = typeof size === 'number' ? { width: size, height: size } : {};

  return (
    <div className={`inline-block ${className}`} style={style} aria-hidden="true">
      <FiLoader className={`animate-spin`} style={{ width: style.width || undefined, height: style.height || undefined }} />
    </div>
  );
};

export default LoadingSpinner;