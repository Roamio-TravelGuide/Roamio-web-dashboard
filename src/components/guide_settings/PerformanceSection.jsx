// src/components/guide_dashboard/settings/PerformanceSection.jsx
import React from 'react';
import { FiStar, FiCalendar, FiDollarSign } from 'react-icons/fi';

const PerformanceSection = ({ performance }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Performance</h2>
      
      {/* Rating Card */}
      <div className="p-4 mb-6 text-center bg-blue-50 rounded-xl">
        <div className="flex items-center justify-center mb-2">
          <FiStar className="mr-1 text-yellow-500 fill-current" />
          <span className="text-2xl font-bold text-gray-800">{performance.rating}</span>
        </div>
        <p className="text-sm text-gray-600">
          Average rating from {performance.reviewsCount} reviews
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="space-y-4">
        <div className="flex items-center p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg shadow-sm">
            <FiCalendar className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tours Conducted</p>
            <p className="text-xl font-semibold text-gray-800">{performance.toursConducted}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg shadow-sm">
            <FiDollarSign className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <p className="text-xl font-semibold text-gray-800">${performance.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;