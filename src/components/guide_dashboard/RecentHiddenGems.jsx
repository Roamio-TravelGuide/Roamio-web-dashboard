import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaClock } from 'react-icons/fa';

const RecentHiddenGems = ({ hiddenGems }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Recently Added Hidden Gems</h2>
      
      {hiddenGems && hiddenGems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hiddenGems.map((gem) => (
            <div key={gem.id} className="overflow-hidden transition-shadow duration-300 border border-gray-200 rounded-lg hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src={gem.picture?.url || '/images/placeholder-gem.jpg'} 
                  alt={gem.title}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{gem.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gem.status)}`}>
                    {gem.status}
                  </span>
                </div>
                
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{gem.description}</p>
                
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{gem.location?.address || 'Location not specified'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(gem.created_at)}</span>
                  </div>
                  
                  {gem.status === 'pending' && (
                    <div className="flex items-center text-sm text-yellow-500">
                      <FaClock className="mr-1" />
                      <span>Pending review</span>
                    </div>
                  )}
                </div>
                
                {gem.rejection_reason && (
                  <div className="p-2 mt-2 rounded-md bg-red-50">
                    <p className="text-xs text-red-600">
                      <strong>Rejection reason:</strong> {gem.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No hidden gems found. Start adding your hidden gems to see them here!</p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All Hidden Gems →
        </button>
      </div>
    </div>
  );
};

export default RecentHiddenGems;