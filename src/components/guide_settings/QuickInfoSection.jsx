// src/components/guide_dashboard/settings/QuickInfoSection.jsx
import React from 'react';
import { FiClock, FiEye, FiGlobe } from 'react-icons/fi';

const QuickInfoSection = ({ profile, performance }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Info</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <FiClock className="mr-3 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium text-gray-800">
              {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FiEye className="mr-3 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="font-medium text-gray-800 capitalize">
              {profile.guides?.verification_status || 'Not verified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FiGlobe className="mr-3 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Response Rate</p>
            <p className="font-medium text-gray-800">{performance.responseRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoSection;