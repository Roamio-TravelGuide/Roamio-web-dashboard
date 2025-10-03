import React from 'react';
import { Headphones, ImageIcon, AlertTriangle } from 'lucide-react';
import { REJECTION_CONFIG } from '../../../utils/constants';

const iconComponents = {
  Headphones,
  ImageIcon,
  AlertTriangle
};

export const RejectionNotice = ({ type, reason }) => {
  const config = REJECTION_CONFIG[type] || REJECTION_CONFIG.general;
  const IconComponent = iconComponents[config.icon];

  return (
    <div className={`p-4 rounded-lg ${config.bg} ${config.border} shadow-xs`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <IconComponent className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 ml-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-red-800">{config.title}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              Requires Action
            </span>
          </div>
          <div className="p-3 mt-2 bg-white border border-red-100 rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{reason}</p>
          </div>
          <div className="mt-2 text-xs text-red-700">
            <p>Please address these issues and resubmit for approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionNotice;