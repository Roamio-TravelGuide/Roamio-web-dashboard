import React from 'react';
import { 
  Clock, CheckCircle, XCircle, ThumbsUp, AlertOctagon 
} from 'lucide-react';
import { STATUS_CONFIG } from '../../../utils/constants';

const iconComponents = {
  ClockIcon: Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
  AlertOctagon
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { 
    bg: 'bg-gray-50 border-gray-200', 
    text: 'text-gray-800', 
    icon: 'AlertOctagon', 
    label: 'Unknown' 
  };

  const IconComponent = iconComponents[config.icon];

  return (
    <div className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="flex items-center mr-1.5">
        <IconComponent className="w-3 h-3" />
      </span>
      {config.label}
    </div>
  );
};

export default StatusBadge;