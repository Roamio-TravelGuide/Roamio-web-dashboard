import React from 'react';

export const SectionHeader = ({ icon: Icon, title, subtitle, children }) => (
  <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="flex items-center font-medium text-gray-800">
          {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

export default SectionHeader;