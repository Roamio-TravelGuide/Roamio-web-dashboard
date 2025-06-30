import React from 'react';
import type { TourPackage, ValidationWarning } from '../../types/tour';
import { MapPin, Clock, DollarSign, Volume2, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';

// Pricing constants
const PRICE_PER_MINUTE = 500; // 500 LKR per minute of audio
const MINIMUM_PRICE = 1000; // Minimum price of 1000 LKR

interface ReviewStepProps {
  tourData: TourPackage;
  validationWarnings: ValidationWarning[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  tourData,
  validationWarnings,
  onSubmit,
  isSubmitting
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate total audio duration in seconds
  const getTotalAudioDuration = () => {
    return tourData.tour_stops.reduce((total, stop) => {
      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      return total + audioFiles.reduce((stopTotal, audio) => stopTotal + (audio.duration_seconds || 0), 0);
    }, 0);
  };

  // Calculate price based on exact audio duration
  const calculatePrice = () => {
    const totalSeconds = getTotalAudioDuration();
    const totalMinutes = totalSeconds / 60; // Exact minute value with decimals
    const basePrice = totalMinutes * PRICE_PER_MINUTE;
    return Math.max(basePrice, MINIMUM_PRICE); // Apply minimum price
  };

  // Format price with LKR currency
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(calculatePrice());

  const getTotalImages = () => {
    return tourData.tour_stops.reduce((total, stop) => {
      return total + (stop.media?.filter(m => m.media_type === 'image').length || 0);
    }, 0);
  };

  const getTotalAudioFiles = () => {
    return tourData.tour_stops.reduce((total, stop) => {
      return total + (stop.media?.filter(m => m.media_type === 'audio').length || 0);
    }, 0);
  };

  const hasErrors = validationWarnings.some(w => w.severity === 'error');
  const hasWarnings = validationWarnings.some(w => w.severity === 'warning');

  // Calculate derived values
  const totalAudioDuration = getTotalAudioDuration();
  const totalPrice = calculatePrice();
  const totalMinutes = totalAudioDuration / 60;
  const preciseMinutes = Math.round(totalMinutes * 100) / 100; // Round to 2 decimal places

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Review Your Tour
        </h2>
        <p className="text-gray-600">
          Review all details before submitting your tour for approval
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tour Overview */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tour Overview</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-gray-900">{tourData.title || 'Untitled Tour'}</h4>
              <p className="mb-4 text-sm text-gray-600">
                {tourData.description || 'No description provided'}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-green-500" size={16} />
                  <div>
                    <span>{totalPrice}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({preciseMinutes.toFixed(2)} mins × LKR {PRICE_PER_MINUTE}/min)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-blue-500" size={16} />
                  <span>{formatTime(totalAudioDuration)} total audio</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 text-center rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">{tourData.tour_stops.length}</div>
                <div className="text-sm text-blue-800">Stops</div>
              </div>
              <div className="p-4 text-center rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">{getTotalAudioFiles()}</div>
                <div className="text-sm text-green-800">Audio Files</div>
              </div>
              <div className="p-4 text-center rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">{getTotalImages()}</div>
                <div className="text-sm text-purple-800">Images</div>
              </div>
              <div className="p-4 text-center rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-600">{formatTime(totalAudioDuration)}</div>
                <div className="text-sm text-amber-800">Total Audio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Stops Detail */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tour Stops</h3>
          
          <div className="space-y-4">
            {tourData.tour_stops.map((stop, index) => {
              const stopWarnings = validationWarnings.filter(w => w.stopIndex === index);
              const hasStopErrors = stopWarnings.some(w => w.severity === 'error');
              const hasStopWarnings = stopWarnings.some(w => w.severity === 'warning');
              const stopAudioDuration = stop.media?.filter(m => m.media_type === 'audio')
                .reduce((total, audio) => total + (audio.duration_seconds || 0), 0) || 0;
              const stopMinutes = stopAudioDuration / 60;

              return (
                <div 
                  key={stop.tempId || stop.id} 
                  className={`p-4 border rounded-lg ${
                    hasStopErrors ? 'border-red-200 bg-red-50' : 
                    hasStopWarnings ? 'border-amber-200 bg-amber-50' : 
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
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

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="text-green-500" size={16} />
                      <span>
                        {stop.media?.filter(m => m.media_type === 'audio').length || 0} audio files
                        {stopAudioDuration > 0 && ` (${(stopMinutes).toFixed(2)} mins)`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="text-blue-500" size={16} />
                      <span>{stop.media?.filter(m => m.media_type === 'image').length || 0} images</span>
                    </div>
                  </div>

                  {stopWarnings.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {stopWarnings.map((warning, i) => (
                        <div 
                          key={i} 
                          className={`flex items-start space-x-2 p-2 text-xs rounded ${
                            warning.severity === 'error' ? 'text-red-700' : 'text-amber-700'
                          }`}
                        >
                          <AlertTriangle size={14} />
                          <span>{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Summary */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Validation Summary</h3>
          
          {validationWarnings.length === 0 ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-medium">All validations passed!</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${
                hasErrors ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <div className="flex items-center space-x-2 font-medium">
                  <AlertTriangle size={18} className={hasErrors ? 'text-red-500' : 'text-amber-500'} />
                  <span>{hasErrors ? 'Critical Issues Found' : 'Recommendations for Improvement'}</span>
                </div>
                <div className="mt-2 text-sm">
                  {hasErrors ? (
                    <p>Please fix the critical issues marked in red before submitting.</p>
                  ) : (
                    <p>Your tour can be submitted, but consider addressing these recommendations for better quality.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submission Guidelines */}
        <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-3 font-medium text-blue-900">Pricing Information</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Price calculated at LKR {PRICE_PER_MINUTE} per exact minute of audio</li>
            <li>• Minimum tour price: LKR {MINIMUM_PRICE.toLocaleString()}</li>
            <li>• Current calculation: {preciseMinutes.toFixed(2)} mins × LKR 500 = {formattedPrice}</li>
            <li>• Ensure all stops have locations and meaningful descriptions</li>
            <li>• Verify that images are high quality and relevant to each stop</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={onSubmit}
            disabled={hasErrors || isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              hasErrors
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSubmitting
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Submitting...' : hasErrors ? 'Fix Errors to Submit' : 'Submit Tour for Review'}
          </button>
          
          {hasWarnings && !hasErrors && (
            <p className="mt-2 text-sm text-amber-600">
              Your tour has recommendations for improvement but can still be submitted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};