import React from 'react';
import { FiArrowRight,FiClock } from 'react-icons/fi';
import { getMediaUrl } from '../../utils/constants';

const TopPerformingTours = ({ tours = [] }) => {
  // Sort tours by bookings and get top 3
  const topTours = [...tours].sort((a, b) => b.bookings - a.bookings).slice(0, 3);
  const hasTours = tours.length > 0;

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Tours</h3>
            <p className="text-sm text-gray-500">
              {hasTours ? 'Ranked by booking volume' : 'No tours available'}
            </p>
          </div>
          {hasTours && tours.length > 3 && (
            <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50">
              View All Tours
              <FiArrowRight className="ml-2" />
            </button>
          )}
        </div>

        {/* Tour Cards */}
        {hasTours ? (
          <div className="grid gap-5 md:grid-cols-3">
            {topTours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center rounded-lg bg-gray-50">
            <div className="p-4 bg-gray-100 rounded-full">
              <FiArrowRight className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-700">No tours available</h4>
            <p className="text-sm text-gray-500">Create your first tour to get started</p>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Create New Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Tour Card Component
const TourCard = ({ tour, rank }) => {
  return (
    <div className="overflow-hidden transition-all duration-200 border border-gray-200 rounded-xl hover:shadow-md">
      <div className="relative h-40 bg-gray-100">
        {tour.cover_image ? (
          <img
            src={getMediaUrl(tour.cover_image.url)}
            alt={tour.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <FiClock className="text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <h4 className="text-sm font-semibold text-white">{tour.title}</h4>
        </div>
        <div className="absolute flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-600 rounded-full top-3 left-3">
          {rank}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-hidden bg-gray-100 rounded-full">
              {tour.guide.user.profile_picture_url ? (
                <img
                  src={getMediaUrl(tour.guide.user.profile_picture_url)}
                  alt={tour.guide.user.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-blue-600 bg-blue-100">
                  <span className="text-xs font-medium">{tour.guide?.user?.name?.charAt(0) || 'G'}</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
              {tour.guide?.user?.name || 'Tour Guide'}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Bookings</p>
            <p className="text-lg font-bold text-gray-700">
              {tour.bookings.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-sm font-medium text-gray-700">
              {tour.rating ? `${tour.rating.toFixed(1)} ★` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-medium text-gray-700">
              ${tour.revenue ? tour.revenue.toLocaleString() : '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformingTours;