import React, { useState, useEffect } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import { AlertTriangle, CheckCircle, Clock, Volume2, Image as ImageIcon } from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';

export const MediaUploadStep = ({
  stops,
  onStopsUpdate
}) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

  useEffect(() => {
    validateAudioDurations();
  }, [stops]);

  const validateAudioDurations = () => {
    const warnings = [];

    stops.forEach((stop, index) => {
      if (index === stops.length - 1) return; // Skip last stop

      const nextStop = stops[index + 1];
      if (!stop.location || !nextStop.location) return;

      const distance = getDistanceBetweenPoints(
        { lat: stop.location.latitude, lng: stop.location.longitude },
        { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
      );

      const walkingTime = getWalkingTime(distance);
      const maxRecommendedAudioTime = Math.floor(walkingTime * 0.8); // 80% rule

      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      const totalAudioDuration = audioFiles.reduce((total, audio) => {
        return total + (audio.duration_seconds || 0);
      }, 0);

      if (totalAudioDuration < maxRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `Audio duration (${formatTime(totalAudioDuration)}) have not exceeds 80% of walking time (${formatTime(maxRecommendedAudioTime)})`,
          severity: 'warning'
        });
      }

      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: 'No audio content added for this stop',
          severity: 'error'
        });
      }
    });

    setValidationWarnings(warnings);
  };

  const handleMediaAdd = (stopIndex, newMedia) => {
    const updatedStops = [...stops];
    const currentMedia = updatedStops[stopIndex].media || [];
    updatedStops[stopIndex] = {
      ...updatedStops[stopIndex],
      media: [...currentMedia, ...newMedia]
    };

    // For audio files, we need to get the duration
    newMedia.forEach((media, mediaIndex) => {
      if (media.media_type === 'audio' && media.file) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(media.file);
        
        audio.addEventListener('loadedmetadata', () => {
          const duration = Math.floor(audio.duration);
          const updatedStopsWithDuration = [...updatedStops];
          const mediaArray = updatedStopsWithDuration[stopIndex].media || [];
          const targetMediaIndex = mediaArray.length - newMedia.length + mediaIndex;
          
          if (mediaArray[targetMediaIndex]) {
            mediaArray[targetMediaIndex] = {
              ...mediaArray[targetMediaIndex],
              duration_seconds: duration
            };
            onStopsUpdate(updatedStopsWithDuration);
          }
        });
      }
    });

    onStopsUpdate(updatedStops);
  };

  const handleMediaRemove = (stopIndex, mediaIndex) => {
    const updatedStops = [...stops];
    const currentMedia = updatedStops[stopIndex].media || [];
    currentMedia.splice(mediaIndex, 1);
    updatedStops[stopIndex] = {
      ...updatedStops[stopIndex],
      media: currentMedia
    };
    onStopsUpdate(updatedStops);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStopValidation = (stopIndex) => {
    const stopWarnings = validationWarnings.filter(w => w.stopIndex === stopIndex);
    const errors = stopWarnings.filter(w => w.severity === 'error');
    const warnings = stopWarnings.filter(w => w.severity === 'warning');

    return { errors, warnings, hasIssues: stopWarnings.length > 0 };
  };

  const getWalkingTimeBetweenStops = (fromIndex, toIndex) => {
    const fromStop = stops[fromIndex];
    const toStop = stops[toIndex];
    
    if (!fromStop.location || !toStop.location) return 0;
    
    const distance = getDistanceBetweenPoints(
      { lat: fromStop.location.latitude, lng: fromStop.location.longitude },
      { lat: toStop.location.latitude, lng: toStop.location.longitude }
    );
    
    return getWalkingTime(distance);
  };

  const getTotalAudioDuration = (stopIndex) => {
    const stop = stops[stopIndex];
    const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
    return audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0);
  };

  const getRecommendedAudioTime = (stopIndex) => {
    if (stopIndex >= stops.length - 1) return null;
    const walkingTime = getWalkingTimeBetweenStops(stopIndex, stopIndex + 1);
    return Math.floor(walkingTime * 0.8);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Upload Media Content
        </h2>
        <p className="text-gray-600">
          Add audio guides and images for each stop of your tour
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Stop Navigation */}
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tour Stops</h3>
          <div className="space-y-2">
            {stops.map((stop, index) => {
              const validation = getStopValidation(index);
              return (
                <button
                  key={stop.tempId || stop.id}
                  onClick={() => setSelectedStopIndex(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative ${
                    selectedStopIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : validation.hasIssues
                      ? 'border-red-200 bg-red-50 hover:border-red-300'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1 space-x-2">
                        <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 truncate">
                          {stop.stop_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Volume2 size={10} />
                          <span>{stop.media?.filter(m => m.media_type === 'audio').length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ImageIcon size={10} />
                          <span>{stop.media?.filter(m => m.media_type === 'image').length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-2">
                      {validation.errors.length > 0 ? (
                        <AlertTriangle className="text-red-500" size={16} />
                      ) : validation.warnings.length > 0 ? (
                        <AlertTriangle className="text-amber-500" size={16} />
                      ) : stop.media && stop.media.length > 0 ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Upload Area */}
        <div className="lg:col-span-3">
          {stops.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No stops available. Please add stops in the previous step.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stops[selectedStopIndex]?.stop_name || `Stop ${selectedStopIndex + 1}`}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Stop {selectedStopIndex + 1} of {stops.length}</span>
                  </div>
                </div>

                {stops[selectedStopIndex]?.description && (
                  <p className="mb-4 text-gray-600">
                    {stops[selectedStopIndex].description}
                  </p>
                )}

                {/* Audio Duration Guidelines */}
                {selectedStopIndex < stops.length - 1 && (
                  <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start space-x-2">
                      <Clock className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h4 className="font-medium text-blue-900">Audio Duration Guidelines</h4>
                        <div className="mt-1 space-y-1 text-sm text-blue-800">
                          <div>Walking time to next stop: {formatTime(getWalkingTimeBetweenStops(selectedStopIndex, selectedStopIndex + 1))}</div>
                          <div>Recommended max audio: {formatTime(getRecommendedAudioTime(selectedStopIndex) || 0)} (80% rule)</div>
                          <div>Current audio duration: {formatTime(getTotalAudioDuration(selectedStopIndex))}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <MediaUpload
                  media={stops[selectedStopIndex]?.media || []}
                  onMediaAdd={(newMedia) => handleMediaAdd(selectedStopIndex, newMedia)}
                  onMediaRemove={(mediaIndex) => handleMediaRemove(selectedStopIndex, mediaIndex)}
                  acceptedTypes={['audio/*', 'image/*']}
                  maxFiles={10}
                />

                {/* Validation Messages */}
                {(() => {
                  const validation = getStopValidation(selectedStopIndex);
                  return (
                    <div className="mt-4 space-y-2">
                      {validation.errors.map((error, index) => (
                        <div key={index} className="flex items-start p-3 space-x-2 border border-red-200 rounded-lg bg-red-50">
                          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-sm text-red-700">{error.message}</span>
                        </div>
                      ))}
                      {validation.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start p-3 space-x-2 border rounded-lg bg-amber-50 border-amber-200">
                          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-sm text-amber-700">{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Validation Summary */}
      {validationWarnings.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="mb-3 font-medium text-gray-900">Validation Summary</h4>
          <div className="space-y-2">
            {validationWarnings.map((warning, index) => {
              const stop = stops[warning.stopIndex];
              return (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <AlertTriangle 
                    className={warning.severity === 'error' ? 'text-red-500' : 'text-amber-500'} 
                    size={14} 
                  />
                  <span className="text-gray-700">
                    <strong>{stop.stop_name}:</strong> {warning.message}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>• <strong>Audio Duration Rule:</strong> Keep audio content under 80% of walking time between stops</p>
            <p>• <strong>Content Guidelines:</strong> Each stop should have at least one audio file</p>
          </div>
        </div>
      )}
    </div>
  );
};