import React, { useMemo } from 'react';
import { FaTimes, FaMapMarkerAlt, FaImage, FaCheck } from 'react-icons/fa';
import { TourStopsMap } from '../tour/TourStopsMap';
import { getMediaUrl } from '../../utils/constants';

const HiddenPlaceDetailModal = ({ 
  isOpen, 
  onClose, 
  selectedPlace, 
  onApprove, 
  onReject,
  isActionLoading 
}) => {
  // Memoize the map stops for the selected place
  const mapStops = useMemo(() => {
    if (!selectedPlace) return [];
    
    return [{
      id: selectedPlace.id,
      sequence_no: 1,
      stop_name: selectedPlace.name || selectedPlace.title || 'Hidden Place',
      description: selectedPlace.description || '',
      location: {
        latitude: selectedPlace.location?.latitude || selectedPlace.latitude || 0,
        longitude: selectedPlace.location?.longitude || selectedPlace.longitude || 0
      }
    }];
  }, [selectedPlace]);

  // Memoize the map component
  const MemoizedHiddenPlaceMap = useMemo(() => {
    if (!selectedPlace) return null;
    
    return (
      <TourStopsMap
        stops={mapStops}
        selectedStopId={selectedPlace.id}
        onSelectStop={() => {}} // No action needed for single stop
      />
    );
  }, [mapStops, selectedPlace]);

  if (!isOpen || !selectedPlace) return null;

  const handleApprove = async () => {
    try {
      await onApprove(selectedPlace.id);
      // Let the parent component handle closing the modal
    } catch (error) {
      console.error('Error approving hidden place:', error);
    }
  };

  const handleReject = async () => {
    try {
      await onReject(selectedPlace.id);
      // Let the parent component handle closing the modal
    } catch (error) {
      console.error('Error rejecting hidden place:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedPlace.name || selectedPlace.title || 'Hidden Place'}
            </h2>
            <p className="text-sm text-gray-500">Hidden Place Details & Verification</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Two Column Layout: Image and Map */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
              {/* Image Section */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-gray-900">Image</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  {selectedPlace.picture?.url || selectedPlace.image_url ? (
                    <img
                      src={getMediaUrl(selectedPlace.picture?.url || selectedPlace.image_url)}
                      alt={selectedPlace.name || selectedPlace.title}
                      className="object-cover w-full h-80"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`items-center justify-center w-full h-80 bg-gray-200 rounded-lg ${
                    selectedPlace.picture?.url || selectedPlace.image_url ? 'hidden' : 'flex'
                  }`}>
                    <div className="text-center">
                      <FaImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No image available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-gray-900">Location on Map</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <div style={{ width: '100%', height: '320px' }}>
                    {MemoizedHiddenPlaceMap}
                  </div>
                </div>
                
                {/* Coordinates Display */}
                <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Coordinates:</span>
                  </div>
                  <div className="mt-1 text-sm text-blue-800">
                    <p><strong>Latitude:</strong> {selectedPlace.location?.latitude || selectedPlace.latitude || 'Not available'}</p>
                    <p><strong>Longitude:</strong> {selectedPlace.location?.longitude || selectedPlace.longitude || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedPlace.description && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900">Description</h3>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-700">{selectedPlace.description}</p>
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-gray-900">Location Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {selectedPlace.location?.address && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900">Address</h4>
                    <p className="mt-1 text-sm text-gray-600">{selectedPlace.location.address}</p>
                  </div>
                )}
                
                {(selectedPlace.location?.city || selectedPlace.location?.district) && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900">City/District</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {[selectedPlace.location?.city, selectedPlace.location?.district]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-gray-900">Additional Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900">Status</h4>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    selectedPlace.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedPlace.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedPlace.status || 'pending'}
                  </span>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900">Submitted By</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedPlace.traveler?.user?.name || 
                     selectedPlace.created_by?.name || 
                     'Unknown'}
                  </p>
                </div>
                
                {selectedPlace.created_at && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900">Submitted Date</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedPlace.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason (if applicable) */}
            {selectedPlace.rejection_reason && (
              <div className="mb-6">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="text-sm font-medium text-red-900">Rejection Reason</h4>
                  <p className="mt-1 text-sm text-red-700">{selectedPlace.rejection_reason}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedPlace.status === 'pending' && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleApprove}
                  disabled={isActionLoading}
                  className="flex-1 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheck className="inline w-4 h-4 mr-2" />
                  Approve Hidden Place
                </button>
                <button
                  onClick={handleReject}
                  disabled={isActionLoading}
                  className="flex-1 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="inline w-4 h-4 mr-2" />
                  Reject Hidden Place
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenPlaceDetailModal;