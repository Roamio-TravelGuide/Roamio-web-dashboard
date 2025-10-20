import React from 'react';
import { MapPin, Clock, DollarSign, Volume2, Image as ImageIcon, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ValidationAlert, SectionHeader } from './common';
import { formatTime, formatPrice, calculateTourPrice } from '../../utils/tourUtils';
import { TOUR_CONSTANTS } from '../../utils/tourConstants';

export const ReviewStep = ({
  tourData,
  validationWarnings = [],
  onSubmit,
  isSubmitting,
  isEditMode = false
}) => {
  // console.log(tourData);
  // Calculate tour statistics
  const getTourStatistics = () => {
    return tourData.tour_stops.reduce((stats, stop) => {
      const audioFiles = stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted
      ) || [];
      
      const images = stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE && !m._deleted
      ) || [];

      return {
        totalAudioDuration: stats.totalAudioDuration + 
          audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0),
        totalImages: stats.totalImages + images.length,
        totalAudioFiles: stats.totalAudioFiles + audioFiles.length
      };
    }, { totalAudioDuration: 0, totalImages: 0, totalAudioFiles: 0 });
  };

  const statistics = getTourStatistics();
  const totalPrice = calculateTourPrice(statistics.totalAudioDuration);
  const totalMinutes = Math.round((statistics.totalAudioDuration / 60) * 100) / 100;

  const hasErrors = validationWarnings.some(w => w.severity === 'error');
  const hasWarnings = validationWarnings.some(w => w.severity === 'warning');

  // Stop card component
  const StopCard = ({ stop, index }) => {
    const stopWarnings = validationWarnings.filter(w => w.stopIndex === index);
    const hasStopErrors = stopWarnings.some(w => w.severity === 'error');
    const hasStopWarnings = stopWarnings.some(w => w.severity === 'warning');
    
    const audioFiles = stop.media?.filter(m => 
      m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted
    ) || [];
    
    const stopAudioDuration = audioFiles.reduce(
      (total, audio) => total + (audio.duration_seconds || 0), 0
    );

    const formattedDuration = formatTime(stopAudioDuration);

    return (
      <div className={`p-4 border rounded-lg ${
        hasStopErrors ? 'border-red-200 bg-red-50' : 
        hasStopWarnings ? 'border-amber-200 bg-amber-50' : 
        'border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white bg-blue-500 rounded-full">
              {index + 1}
            </span>
            <div>
              <h4 className="font-medium text-gray-900">{stop.stop_name}</h4>
              {stop.description && (
                <p className="mt-1 text-sm text-gray-600">{stop.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {stop.location ? (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <MapPin size={12} />
                <span>Located</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-xs text-red-600">
                <AlertTriangle size={12} />
                <span>No location</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div className="flex items-center space-x-2">
            <Volume2 className="text-green-500" size={16} />
            <span>
              {audioFiles.length} audio file{audioFiles.length !== 1 ? 's' : ''}
              {stopAudioDuration > 0 && <span> ({formattedDuration})</span>}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ImageIcon className="text-blue-500" size={16} />
            <span>
              {stop.media?.filter(m => 
                m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE && !m._deleted
              ).length || 0} images
            </span>
          </div>
        </div>

        {stopWarnings.length > 0 && (
          <div className="mt-3 space-y-2">
            {stopWarnings.map((warning, i) => (
              <ValidationAlert
                key={i}
                type={warning.severity}
                message={warning.message}
                icon={AlertTriangle}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Review Your Tour Updates' : 'Review Your Tour'}
        </h2>
        <p className="mt-2 text-gray-600">
          {isEditMode 
            ? 'Review all changes before updating your tour' 
            : 'Review all details before submitting your tour for approval'
          }
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Summary Panel */}
        <div className="lg:w-1/3">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <SectionHeader title="Tour Summary" />
            
            <div className="p-5 space-y-6">
              <div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">
                  {tourData.title || 'Untitled Tour'}
                </h4>
                <p className="text-sm text-gray-600">
                  {tourData.description || 'No description provided'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Price Card */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-blue-600" size={18} />
                      <span className="font-medium text-blue-900">Total Price</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-blue-800">
                    {totalMinutes.toFixed(2)} minutes × LKR {TOUR_CONSTANTS.PRICE_PER_MINUTE}/min
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {tourData.tour_stops.length}
                    </div>
                    <div className="text-sm text-gray-700">Stops</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {statistics.totalAudioFiles}
                    </div>
                    <div className="text-sm text-gray-700">Audio Files</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {statistics.totalImages}
                    </div>
                    <div className="text-sm text-gray-700">Images</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {formatTime(statistics.totalAudioDuration)}
                    </div>
                    <div className="text-sm text-gray-700">Total Audio</div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <ValidationAlert type="info" title="Pricing Information">
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Minimum price: {formatPrice(TOUR_CONSTANTS.MINIMUM_PRICE)}</li>
                  <li>• LKR {TOUR_CONSTANTS.PRICE_PER_MINUTE} per minute of audio</li>                 
                  <li>• Price calculated automatically</li>
                </ul>
              </ValidationAlert>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={onSubmit}
              disabled={isSubmitting || hasErrors}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : hasErrors 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Clock className="mr-2 animate-spin" size={18} />
                  {isEditMode ? 'Updating...' : 'Submitting...'}
                </span>
              ) : hasErrors ? (
                'Fix Errors to Submit'
              ) : (
                isEditMode ? 'Update Tour' : 'Submit for Approval'
              )}
            </button>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:w-2/3">
          {/* Tour Stops */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <SectionHeader 
              title="Tour Stops"
              subtitle="Detailed breakdown of each stop"
            />
            
            <div className="p-5 space-y-4">
              {tourData.tour_stops.map((stop, index) => (
                <StopCard key={stop.tempId || stop.id} stop={stop} index={index} />
              ))}
            </div>
          </div>

          {/* Validation Summary */}
          <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
            <SectionHeader title="Validation Summary" />
            
            <div className="p-5">
              {validationWarnings.length === 0 ? (
                <ValidationAlert 
                  type="success"
                  title="All validations passed!"
                  message={isEditMode 
                    ? 'Your tour updates are ready' 
                    : 'Your tour is ready for submission'
                  }
                  icon={CheckCircle}
                />
              ) : (
                <ValidationAlert 
                  type={hasErrors ? 'error' : 'warning'}
                  title={hasErrors ? 'Critical Issues Found' : 'Recommendations for Improvement'}
                  message={hasErrors 
                    ? 'Please fix the critical issues marked in red before submitting.'
                    : 'Your tour can be submitted, but consider addressing these recommendations for better quality.'
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;