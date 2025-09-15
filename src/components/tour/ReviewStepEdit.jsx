import React from 'react';
import { MapPin, Clock, DollarSign, Volume2, Image as ImageIcon, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const PRICE_PER_MINUTE = 500; 
const MINIMUM_PRICE = 1000; 

export const ReviewStepEdit = ({
  tourData,
  validationWarnings = [],
  onSubmit,
  isSubmitting
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTotalAudioDuration = () => {
    return tourData.tour_stops.reduce((total, stop) => {
      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      return total + audioFiles.reduce((stopTotal, audio) => stopTotal + (audio.duration_seconds || 0), 0);
    }, 0);
  };

  const calculatePrice = () => {
    const totalSeconds = getTotalAudioDuration();
    const totalMinutes = totalSeconds / 60;
    const basePrice = totalMinutes * PRICE_PER_MINUTE;
    return Math.max(basePrice, MINIMUM_PRICE);
  };

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

  const totalAudioDuration = getTotalAudioDuration();
  const totalPrice = calculatePrice();
  const totalMinutes = totalAudioDuration / 60;
  const preciseMinutes = Math.round(totalMinutes * 100) / 100;

  return (
    <div className="mx-auto">
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Review Your Tour Updates</h2>
        <p className="mt-2 text-gray-600">
          Review all changes before updating your tour
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-1/3">
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="font-medium text-gray-800">Tour Summary</h3>
            </div>
            
            <div className="p-5 space-y-6">
              <div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">{tourData.title || 'Untitled Tour'}</h4>
                <p className="text-sm text-gray-600">
                  {tourData.description || 'No description provided'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-blue-600" size={18} />
                      <span className="font-medium text-blue-900">Total Price</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">{formattedPrice}</span>
                  </div>
                  <div className="mt-2 text-xs text-blue-800">
                    {preciseMinutes.toFixed(2)} minutes × LKR {PRICE_PER_MINUTE}/min
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{tourData.tour_stops.length}</div>
                    <div className="text-sm text-gray-700">Stops</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getTotalAudioFiles()}</div>
                    <div className="text-sm text-gray-700">Audio Files</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{getTotalImages()}</div>
                    <div className="text-sm text-gray-700">Images</div>
                  </div>
                  <div className="p-4 text-center border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{formatTime(totalAudioDuration)}</div>
                    <div className="text-sm text-gray-700">Total Audio</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start space-x-2">
                  <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-blue-900">Pricing Information</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                      <li>• LKR {PRICE_PER_MINUTE} per minute of audio</li>
                      <li>• Minimum price: LKR {MINIMUM_PRICE.toLocaleString()}</li>
                      <li>• Price calculated automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onSubmit}
              disabled={isSubmitting || hasErrors}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
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
                  Updating...
                </span>
              ) : hasErrors ? (
                'Fix Errors to Update'
              ) : (
                'Update Tour'
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="font-medium text-gray-800">Tour Stops</h3>
              <p className="mt-1 text-sm text-gray-600">Detailed breakdown of each stop</p>
            </div>
            
            <div className="p-5 space-y-4">
              {tourData.tour_stops.map((stop, index) => {
                const stopWarnings = validationWarnings.filter(w => w.stopIndex === index);
                const hasStopErrors = stopWarnings.some(w => w.severity === 'error');
                const hasStopWarnings = stopWarnings.some(w => w.severity === 'warning');
                const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
                const stopAudioDuration = audioFiles.reduce((total, audio) => {
                  return total + (audio.duration_seconds || 0);
                }, 0);

                const formattedDuration = new Date(stopAudioDuration * 1000)
                  .toISOString()
                  .substring(14, 19);

                return (
                  <div 
                    key={stop.tempId || stop.id} 
                    className={`p-4 border rounded-lg ${
                      hasStopErrors ? 'border-red-200 bg-red-50' : 
                      hasStopWarnings ? 'border-amber-200 bg-amber-50' : 
                      'border-gray-200'
                    }`}
                  >
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
                          {stopAudioDuration > 0 && (
                            <span> ({formattedDuration})</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="text-blue-500" size={16} />
                        <span>{stop.media?.filter(m => m.media_type === 'image').length || 0} images</span>
                      </div>
                    </div>

                    {stopWarnings.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {stopWarnings.map((warning, i) => (
                          <div 
                            key={i} 
                            className={`flex items-start space-x-2 p-2 text-xs rounded ${
                              warning.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
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

          <div className="mt-6 overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="font-medium text-gray-800">Validation Summary</h3>
            </div>
            
            <div className="p-5">
              {validationWarnings.length === 0 ? (
                <div className="flex items-center p-4 space-x-3 rounded-lg bg-green-50">
                  <CheckCircle className="text-green-500" size={20} />
                  <div>
                    <h4 className="font-medium text-green-800">All validations passed!</h4>
                    <p className="text-sm text-green-700">Your tour is ready for update</p>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-lg ${
                  hasErrors ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle 
                      size={18} 
                      className={hasErrors ? 'text-red-500' : 'text-amber-500'} 
                    />
                    <div>
                      <h4 className="font-medium">
                        {hasErrors ? 'Critical Issues Found' : 'Recommendations for Improvement'}
                      </h4>
                      <p className="mt-1 text-sm">
                        {hasErrors ? (
                          'Please fix the critical issues marked in red before updating.'
                        ) : (
                          'Your tour can be updated, but consider addressing these recommendations for better quality.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};