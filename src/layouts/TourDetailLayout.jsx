import React from 'react';
import { 
  ArrowLeft, Clock, MapPin, User, ImageIcon, 
  Edit, Trash2, Headphones, RotateCcw, Loader2 
} from 'lucide-react';
import StatusBadge from '../components/tour/details/StatusBadge';
import RejectionNotice from '../components/tour/details/RejectionNotice';
import { getMediaUrl } from '../utils/constants';

export const TourDetailLayout = ({ 
  tour, 
  selectedStopId,
  onBack,
  onEdit,
  onDelete,
  onRefreshMedia,
  isRefreshing,
  children 
}) => {
  const selectedStop = tour?.tour_stops?.find(stop => stop.id === selectedStopId);
  // console.log(tour.cover_image.url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <button
                onClick={onBack}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </button>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">{tour.title}</h1>
            </div>
            
            {/* Only show Edit/Delete buttons if tour is rejected */}
            {tour.status === 'rejected' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onEdit}
                  className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit Trip
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete Trip
                </button>
              </div>
            )}
          </div>

          {/* Tour Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Tour Cover Image */}
            <div className="md:col-span-1">
              {tour.cover_image.url ? (
                <div className="relative w-full h-40 overflow-hidden border border-gray-200 rounded-lg shadow-xs">
                  <img
                    src={getMediaUrl(tour.cover_image.url)}
                    alt="Tour Cover"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <StatusBadge status={tour.status} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-40 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg">
                  <ImageIcon className="w-8 h-8 text-gray-900" />
                </div>
              )}
            </div>

            {/* Tour Details */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs md:col-span-2">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Tour Overview</h2>
                <p className="mt-1 text-sm text-gray-600">{tour.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-700">
                      {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                    <span className="text-green-600">💰</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-medium text-gray-700">${tour.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stops</p>
                    <p className="text-sm font-medium text-gray-700">{tour.tour_stops?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50">
                    <User className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created By</p>
                    <p className="text-sm font-medium text-gray-700">You</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            <div className="md:col-span-1">
              <div className="h-full p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
                <div className="flex items-center space-x-3">
                  {tour.guide?.user?.avatar_url ? (
                    <img
                      src={getMediaUrl(tour.guide.user.avatar_url)}
                      alt={tour.guide.user.name}
                      className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border-2 border-white rounded-full">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {tour.guide?.user?.name || 'Unknown Guide'}
                    </h3>
                    {tour.guide?.years_of_experience && (
                      <p className="text-xs text-gray-600">{tour.guide.years_of_experience} yrs exp</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tour-Level Rejection */}
          {tour.status === 'rejected' && tour.rejection_reason && (
            <div className="mt-6">
              <RejectionNotice 
                type="general" 
                reason={tour.rejection_reason} 
              />
              
              <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-semibold text-blue-800">Next Steps</h4>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">1</span>
                    Review all rejection notices carefully
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">2</span>
                    Make the necessary corrections to your content
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">3</span>
                    Ensure all media meets quality guidelines
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">4</span>
                    Resubmit for approval when ready
                  </li>
                </ol>
                <div className="pt-3 mt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    Need help? Contact our support team for clarification on any rejection reasons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Combined Tour Stops + Media Content */}
          <div className="lg:col-span-2">
            {children[0]}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1">
            <div className="sticky bg-white border border-gray-200 shadow-sm rounded-xl top-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Tour Route Map</h3>
                  <button
                    onClick={onRefreshMedia}
                    disabled={isRefreshing}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh media URLs"
                  >
                    {isRefreshing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {selectedStop && (
                  <p className="text-sm text-gray-500">
                    Currently viewing: <span className="font-medium">{selectedStop.stop_name}</span>
                  </p>
                )}
              </div>
              <div className="overflow-hidden h-96 rounded-b-xl">
                {children[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailLayout;