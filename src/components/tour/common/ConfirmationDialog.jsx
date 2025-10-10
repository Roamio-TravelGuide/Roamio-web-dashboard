import React from 'react';
import { AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../ui/LoadingSpinner';

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const config = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-100',
      confirmColor: 'bg-amber-600 hover:bg-amber-700'
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
      confirmColor: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100',
      confirmColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const { icon: Icon, iconColor, bgColor, confirmColor } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 p-2 rounded-full ${bgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={`px-4 py-2 text-sm font-medium text-white transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${confirmColor}`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <LoadingSpinner size={16} className="text-white mr-2" />
                    Processing...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;