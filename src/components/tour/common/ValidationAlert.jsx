import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const ValidationAlert = ({ 
  type = 'warning', 
  title, 
  message, 
  icon: CustomIcon,
  children 
}) => {
  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertTriangle,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  };

  const { bg, border, text, icon: DefaultIcon, iconColor } = config[type];
  const IconComponent = CustomIcon || DefaultIcon;

  return (
    <div className={`p-4 border rounded-lg ${bg} ${border}`}>
      <div className="flex items-start space-x-2">
        <IconComponent className={`flex-shrink-0 mt-0.5 ${iconColor}`} size={16} />
        <div className="flex-1">
          {title && <h4 className="font-medium">{title}</h4>}
          {message && <p className="text-sm mt-1">{message}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ValidationAlert;