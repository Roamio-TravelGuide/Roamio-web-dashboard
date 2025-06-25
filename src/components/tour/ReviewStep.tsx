import React from 'react';
import type { TourPackage, ValidationWarning } from '../../types/tour';
import { MapPin, Clock, DollarSign, Volume2, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';

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

  const getTotalAudioDuration = () => {
    return tourData.tour_stops.reduce((total, stop) => {
      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      return total + audioFiles.reduce((stopTotal, audio) => stopTotal + (audio.duration_seconds || 0), 0);
    }, 0);
  };

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
              <h4 className="mb-2 font-medium text-gray-900">{tourData.title}</h4>
              <p className="mb-4 text-sm text-gray-600">
                {tourData.description || 'No description provided'}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-green-500" size={16} />
                  <span>LKR {tourData.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-blue-500" size={16} />
                  <span>{tourData.duration_minutes} minutes estimated duration</span>
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
                <div className="text-2xl font-bold text-amber-600">{formatTime(getTotalAudioDuration())}</div>
                <div className="text-sm text-amber-800">Total Audio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Stops Detail */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tour Stops</h3>
          
          <div className="space-y-4">
            {tourData.tour_stops.map((stop, index) => (
              <div key={stop.tempId || stop.id} className="p-4 border border-gray-200 rounded-lg">
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
                      {(() => {
                        const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
                        const totalDuration = audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0);
                        return totalDuration > 0 ? ` (${formatTime(totalDuration)})` : '';
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="text-blue-500" size={16} />
                    <span>{stop.media?.filter(m => m.media_type === 'image').length || 0} images</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Validation Status</h3>
          
          {validationWarnings.length === 0 ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-medium">All validations passed!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {validationWarnings.map((warning, index) => {
                const stop = tourData.tour_stops[warning.stopIndex];
                return (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 p-3 rounded-lg ${
                      warning.severity === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <AlertTriangle
                      className={warning.severity === 'error' ? 'text-red-500' : 'text-amber-500'}
                      size={16}
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {stop.stop_name} (Stop {warning.stopIndex + 1})
                      </div>
                      <div className={`text-sm ${warning.severity === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                        {warning.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submission Guidelines */}
        <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-3 font-medium text-blue-900">Before You Submit</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Ensure all stops have meaningful names and descriptions</li>
            <li>• Verify that audio content is appropriate and high quality</li>
            <li>• Check that image content is relevant to the tour stops</li>
            <li>• Review pricing to ensure it's competitive and fair</li>
            <li>• Your tour will be reviewed by moderators before approval</li>
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
              Your tour has warnings but can still be submitted. Consider addressing them for better approval chances.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};