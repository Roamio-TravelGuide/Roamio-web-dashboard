import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import { AlertTriangle, CheckCircle, Clock, Volume2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';
import { useUploadSession } from '../../hooks/useUploadSession';
import { uploadtempmedia, deletetempmedia } from '../../api/tour/tourApi';
import { toast } from 'react-hot-toast';

const MEDIA_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image'
};

export const MediaUploadStepEdit = ({
  tourData,
  stops = [], 
  onStopsUpdate,
  onUpdate,
  onValidationChange
}) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();
  const sessionId = useUploadSession();

  useEffect(() => {
    validateAudioDurations();
  }, [stops]);

  useEffect(() => {
    if (onValidationChange) {
      const hasErrors = validationWarnings.some(w => w.severity === 'error');
      onValidationChange(!hasErrors);
    }
  }, [validationWarnings, onValidationChange]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getAudioDuration = useCallback((file) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        URL.revokeObjectURL(audio.src);
        resolve(duration);
      });
      
      audio.addEventListener('error', () => {
        resolve(0);
      });
    });
  }, []);

  const validateAudioDurations = useCallback(() => {
    const warnings = [];

    stops.forEach((stop, index) => {
      if (index === stops.length - 1) return;

      const nextStop = stops[index + 1];
      if (!stop.location || !nextStop.location) return;

      const distance = getDistanceBetweenPoints(
        { lat: stop.location.latitude, lng: stop.location.longitude },
        { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
      );

      const walkingTime = getWalkingTime(distance);
      const minRecommendedAudioTime = Math.floor(walkingTime * 0.8);

      const audioFiles = stop.media?.filter(m => {
        const mediaType = m.media?.media_type || m.media_type;
        return mediaType === MEDIA_TYPES.AUDIO;
      }) || [];
      
      const totalAudioDuration = audioFiles.reduce((total, audio) => {
        const duration = audio.media?.duration_seconds || audio.duration_seconds || 0;
        return total + duration;
      }, 0);

      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: 'At least one audio file is required for this stop',
          severity: 'error'
        });
      }

      if (totalAudioDuration < minRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `Recommended minimum audio duration is ${formatTime(minRecommendedAudioTime)} (${formatTime(totalAudioDuration)} currently)`,
          severity: 'warning'
        });
      }
    });

    setValidationWarnings(warnings);
  }, [stops, getDistanceBetweenPoints, getWalkingTime]);

  const handleMediaAdd = useCallback(async (stopIndex, newMedia) => {
    if (!sessionId) {
      toast.error('Upload service is initializing. Please try again in a moment.');
      return;
    }

    const uploadToast = toast.loading('Uploading media files...');
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const updatedStops = [...stops];
      updatedStops[stopIndex] = {
        ...updatedStops[stopIndex],
        media: [
          ...(updatedStops[stopIndex].media || []),
          ...newMedia.map(file => ({
            ...file,
            isUploading: true,
            tempUrl: file.format.startsWith('image/') ? URL.createObjectURL(file.file) : null
          }))
        ]
      };
      onStopsUpdate(updatedStops);

      const uploadedMedia = await Promise.all(
        newMedia.map(async (media) => {
          const formData = new FormData();
          formData.append('file', media.file);
          formData.append('type', media.format.startsWith('audio/') ? 'stop_audio' : 'stop_image');
          formData.append('tour_id', tourData.id);
          formData.append('stopIndex', stopIndex);

          const response = await uploadtempmedia(formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              toast.loading(`Uploading media files... ${percentCompleted}%`, { id: uploadToast });
            }
          });
          
          const duration = media.format.startsWith('audio/') 
            ? await getAudioDuration(media.file) 
            : 0;

          return {
            ...response,
            media_type: media.format.startsWith('audio/') ? MEDIA_TYPES.AUDIO : MEDIA_TYPES.IMAGE,
            duration_seconds: duration,
            tempUrl: media.format.startsWith('image/') ? URL.createObjectURL(media.file) : null
          };
        })
      );

      const finalUpdatedStops = [...stops];
      finalUpdatedStops[stopIndex] = {
        ...finalUpdatedStops[stopIndex],
        media: [
          ...(finalUpdatedStops[stopIndex].media || []).filter(m => !m.isUploading),
          ...uploadedMedia
        ]
      };

      onStopsUpdate(finalUpdatedStops);
      toast.success('Media files uploaded successfully!', { id: uploadToast });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.error || 'Upload failed. Please try again.', { id: uploadToast });
      
      const cleanedStops = [...stops];
      cleanedStops[stopIndex] = {
        ...cleanedStops[stopIndex],
        media: (cleanedStops[stopIndex].media || []).filter(m => !m.isUploading)
      };
      onStopsUpdate(cleanedStops);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [sessionId, stops, onStopsUpdate, getAudioDuration]);

  const handleMediaRemove = useCallback(async (stopIndex, mediaIndex) => {
    const deleteToast = toast.loading('Removing media file...');
    const updatedStops = [...stops];
    const mediaToRemove = updatedStops[stopIndex].media?.[mediaIndex];
    
    try {
      setIsUploading(true);
      
      updatedStops[stopIndex].media.splice(mediaIndex, 1);
      onStopsUpdate(updatedStops);

      if (mediaToRemove?.key) {
        await deletetempmedia(mediaToRemove.key);
      }
      
      if (mediaToRemove?.tempUrl) {
        URL.revokeObjectURL(mediaToRemove.tempUrl);
      }
      
      toast.success('Media file removed successfully', { id: deleteToast });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media. Please try again.', { id: deleteToast });
      onStopsUpdate([...stops]);
    } finally {
      setIsUploading(false);
    }
  }, [stops, onStopsUpdate]);

  const currentStop = stops[selectedStopIndex] || {};
  const stopValidation = useMemo(() => {
    const errors = validationWarnings.filter(w => 
      w.stopIndex === selectedStopIndex && w.severity === 'error'
    );
    const warnings = validationWarnings.filter(w => 
      w.stopIndex === selectedStopIndex && w.severity === 'warning'
    );
    return { errors, warnings, hasIssues: errors.length > 0 || warnings.length > 0 };
  }, [validationWarnings, selectedStopIndex]);

  const walkingTimeToNextStop = useMemo(() => {
    if (selectedStopIndex >= stops.length - 1) return 0;
    const fromStop = stops[selectedStopIndex];
    const toStop = stops[selectedStopIndex + 1];
    
    if (!fromStop.location || !toStop.location) return 0;
    
    const distance = getDistanceBetweenPoints(
      { lat: fromStop.location.latitude, lng: fromStop.location.longitude },
      { lat: toStop.location.latitude, lng: toStop.location.longitude }
    );
    
    return getWalkingTime(distance);
  }, [selectedStopIndex, stops, getDistanceBetweenPoints, getWalkingTime]);

  const recommendedAudioTime = useMemo(() => 
    Math.floor(walkingTimeToNextStop * 0.8),
    [walkingTimeToNextStop]
  );

  const totalAudioDuration = useMemo(() => 
    (currentStop.media || [])
      .filter(m => {
        const mediaType = m.media?.media_type || m.media_type;
        return mediaType === MEDIA_TYPES.AUDIO;
      })
      .reduce((total, audio) => {
        const duration = audio.media?.duration_seconds || audio.duration_seconds || 0;
        return total + duration;
      }, 0),
    [currentStop]
  );

  const renderStopNavigation = () => (
    <div className="lg:w-1/4">
      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
          <h3 className="font-medium text-gray-800">Tour Stops</h3>
          <p className="mt-1 text-sm text-gray-600">
            Select a stop to edit media
          </p>
        </div>
        
        <div className="p-5 space-y-2">
          {stops.map((stop, index) => {
            const validation = validationWarnings.filter(w => w.stopIndex === index);
            const hasErrors = validation.some(w => w.severity === 'error');
            const hasWarnings = validation.some(w => w.severity === 'warning');
            
            return (
              <button
                key={stop.tempId || stop.id}
                onClick={() => !isUploading && setSelectedStopIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative ${
                  selectedStopIndex === index
                    ? 'bg-blue-100 border border-blue-300'
                    : hasErrors
                    ? 'bg-red-50 border border-red-200 hover:border-red-300'
                    : hasWarnings
                    ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isUploading ? 'cursor-not-allowed' : ''}`}
                disabled={isUploading}
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
                        <span>
                          {stop.media?.filter(m => {
                            const mediaType = m.media?.media_type || m.media_type;
                            return mediaType === MEDIA_TYPES.AUDIO;
                          }).length || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ImageIcon size={10} />
                        <span>
                          {stop.media?.filter(m => {
                            const mediaType = m.media?.media_type || m.media_type;
                            return mediaType === MEDIA_TYPES.IMAGE;
                          }).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-2">
                    {hasErrors ? (
                      <AlertTriangle className="text-red-500" size={16} />
                    ) : hasWarnings ? (
                      <AlertTriangle className="text-amber-500" size={16} />
                    ) : stop.media?.length > 0 ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMediaUploadArea = () => (
    <div className="space-y-6">
      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">
              {currentStop.stop_name || `Stop ${selectedStopIndex + 1}`}
            </h3>
            <div className="text-sm text-gray-600">
              Stop {selectedStopIndex + 1} of {stops.length}
            </div>
          </div>
        </div>
        
        <div className="p-5 space-y-6">
          {currentStop.description && (
            <p className="text-gray-700">{currentStop.description}</p>
          )}

          {selectedStopIndex < stops.length - 1 && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start space-x-2">
                <Clock className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-blue-900">Audio Duration Guidelines</h4>
                  <div className="mt-1 space-y-1 text-sm text-blue-800">
                    <div>Walking time to next stop: {formatTime(walkingTimeToNextStop)}</div>
                    <div>Recommended min audio: {formatTime(recommendedAudioTime)}</div>
                    <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <MediaUpload
            media={currentStop.media || []}
            onMediaAdd={(newMedia) => handleMediaAdd(selectedStopIndex, newMedia)}
            onMediaRemove={(mediaIndex) => handleMediaRemove(selectedStopIndex, mediaIndex)}
            acceptedTypes={['audio/*', 'image/*']}
            maxFiles={10}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          <div className="space-y-2">
            {stopValidation.errors.map((error, index) => (
              <div key={index} className="flex items-start p-3 space-x-2 border border-red-200 rounded-lg bg-red-50">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-red-700">{error.message}</span>
              </div>
            ))}
            {stopValidation.warnings.map((warning, index) => (
              <div key={index} className="flex items-start p-3 space-x-2 border rounded-lg bg-amber-50 border-amber-200">
                <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-amber-700">{warning.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderValidationSummary = () => (
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
        <h3 className="font-medium text-gray-800">Content Requirements</h3>
      </div>
      
      <div className="p-5 space-y-4">
        {validationWarnings.length > 0 ? (
          <>
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
            
            <div className="p-4 text-sm border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="mb-2 font-medium text-gray-800">Content Guidelines</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Required:</strong> Each stop must have at least one audio file</li>
                <li>• <strong>Recommended:</strong> Audio duration should be more than 80% of walking time between stops</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center p-4 space-x-2 border border-green-200 rounded-lg bg-green-50">
            <CheckCircle className="text-green-500" size={16} />
            <span className="text-sm text-green-700">All stops meet the content requirements</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`mx-auto ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}>
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
        <p className="mt-2 text-gray-600">
          Update audio guides and images for each stop of your tour
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {renderStopNavigation()}
        <div className="lg:w-3/4">
          {stops.length === 0 ? (
            <div className="p-6 text-center border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-600">No stops available. Please add stops in the previous step.</p>
            </div>
          ) : (
            <>
              {renderMediaUploadArea()}
              {renderValidationSummary()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};