import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Image as ImageIcon 
} from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';
import { toast } from 'react-hot-toast';
import { ValidationAlert, SectionHeader } from './common';
import { formatTime, getAudioDuration } from '../../utils/tourUtils';
import { TOUR_CONSTANTS, VALIDATION_MESSAGES } from '../../utils/tourConstants';
import { getMediaUrl } from '../../utils/constants';

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Hook for media URL and name processing
 */
const useMediaProcessor = () => {
  const getMediaWithUrl = useCallback((mediaArray) => {
    if (!mediaArray || !Array.isArray(mediaArray)) return [];
    
    return mediaArray.map(mediaItem => {
      const mediaWithUrl = { ...mediaItem };
      
      // Handle URLs - fix URL generation
      if (mediaItem.temp_url) {
        mediaWithUrl.display_url = mediaItem.temp_url;
      } else if (mediaItem.url) {
        mediaWithUrl.display_url = getMediaUrl(mediaItem.url);
      } else if (mediaItem.file_url) {
        mediaWithUrl.display_url = getMediaUrl(mediaItem.file_url);
      }
      
      // FIXED: Better file name generation
      let displayName = 'Unknown file';
      
      // For new files with file object
      if (mediaItem.file && mediaItem.file.name) {
        displayName = mediaItem.file.name;
      }
      // For existing files from API
      else if (mediaItem.original_name) {
        displayName = mediaItem.original_name;
      }
      else if (mediaItem.file_name) {
        // Convert "file_36" to descriptive name
        const fileExt = mediaItem.file_type?.split('/')[1] || 
                       (mediaItem.file_name.includes('.') 
                        ? mediaItem.file_name.split('.').pop() 
                        : 'file');
        
        if (mediaItem.media_type === 'audio') {
          displayName = `Audio recording_${mediaItem.id || 'new'}.${fileExt}`;
        } else if (mediaItem.media_type === 'image') {
          displayName = `Tour image_${mediaItem.id || 'new'}.${fileExt}`;
        } else {
          displayName = mediaItem.file_name;
        }
      }
      else if (mediaItem.name) {
        displayName = mediaItem.name;
      }
      // Final fallback
      else if (mediaItem.media_type === 'audio') {
        displayName = `Audio recording_${mediaItem.id || 'new'}.mp3`;
      } else if (mediaItem.media_type === 'image') {
        displayName = `Tour image_${mediaItem.id || 'new'}.jpg`;
      }
      
      // Set name properties
      mediaWithUrl.display_name = displayName;
      mediaWithUrl.name = mediaItem.name || displayName;
      mediaWithUrl.original_name = mediaItem.original_name || displayName;
      
      return mediaWithUrl;
    });
  }, []);

  return { getMediaWithUrl };
};

/**
 * Hook for validation logic
 */
const useMediaValidation = (stops, getDistanceBetweenPoints, getWalkingTime) => {
  const validationWarnings = useMemo(() => {
    const warnings = [];

    stops.forEach((stop, index) => {
      // FIXED: Check ALL stops for audio requirement, not just non-last stops
      const nonDeletedMedia = stop.media?.filter(m => !m._deleted && !m._destroy) || [];
      const audioFiles = nonDeletedMedia.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO
      );

      // REQUIRED: Every stop must have at least one audio file
      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: VALIDATION_MESSAGES.REQUIRED_AUDIO,
          severity: 'error'
        });
      }

      // Only check duration for non-last stops
      if (index < stops.length - 1) {
        const nextStop = stops[index + 1];
        if (!stop.location || !nextStop.location) return;

        // Calculate distance and walking time
        const distance = getDistanceBetweenPoints(
          { lat: stop.location.latitude, lng: stop.location.longitude },
          { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
        );

        const walkingTime = getWalkingTime(distance);
        const minRecommendedAudioTime = Math.floor(walkingTime * 0.8);
        
        const totalAudioDuration = audioFiles.reduce(
          (total, audio) => total + (audio.duration_seconds || 0), 0
        );

        // Recommended validation - audio duration should be sufficient
        if (audioFiles.length > 0 && totalAudioDuration < minRecommendedAudioTime) {
          warnings.push({
            stopIndex: index,
            message: `${VALIDATION_MESSAGES.INSUFFICIENT_AUDIO} ${formatTime(minRecommendedAudioTime)} (${formatTime(totalAudioDuration)} currently)`,
            severity: 'warning'
          });
        }
      }
    });

    console.log('Validation warnings:', warnings);
    return warnings;
  }, [stops, getDistanceBetweenPoints, getWalkingTime]);

  return { validationWarnings };
};

/**
 * Hook for media operations (add/remove)
 */
const useMediaOperations = (stops, onStopsUpdate, isEditable) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMediaAdd = useCallback(async (stopIndex, newMedia) => {
    if (!isEditable) return;
    
    const processToast = toast.loading('Processing media files...');
    setIsProcessing(true);
    
    try {
      const updatedStops = [...stops];
      const processedMedia = await Promise.all(
        newMedia.map(async (fileObj) => {
          const duration = fileObj.file.type.startsWith('audio/') 
            ? await getAudioDuration(fileObj.file) 
            : 0;

          const tempUrl = fileObj.file.type.startsWith('image/') 
            ? URL.createObjectURL(fileObj.file) 
            : null;

          return {
            file: fileObj.file,
            media_type: fileObj.file.type.startsWith('audio/') 
              ? TOUR_CONSTANTS.MEDIA_TYPES.AUDIO 
              : TOUR_CONSTANTS.MEDIA_TYPES.IMAGE,
            duration_seconds: duration,
            file_name: fileObj.file.name,
            original_name: fileObj.file.name, // Ensure original_name is set
            file_type: fileObj.file.type,
            file_size: fileObj.file.size,
            temp_url: tempUrl,
            isNew: true,
            display_url: tempUrl
          };
        })
      );

      updatedStops[stopIndex] = {
        ...updatedStops[stopIndex],
        media: [
          ...(updatedStops[stopIndex].media || []),
          ...processedMedia
        ]
      };

      onStopsUpdate(updatedStops);
      toast.success('Media files processed successfully!', { id: processToast });
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error('Failed to process media files. Please try again.', { id: processToast });
    } finally {
      setIsProcessing(false);
    }
  }, [stops, onStopsUpdate, isEditable]);

  const handleMediaRemove = useCallback(async (stopIndex, mediaIndex) => {
    if (!isEditable) return;
    
    const deleteToast = toast.loading('Removing media file...');
    
    try {
      setIsProcessing(true);
      
      // Create deep copy to ensure React detects changes
      const updatedStops = JSON.parse(JSON.stringify(stops));
      
      // Validate indices
      if (!updatedStops[stopIndex] || !updatedStops[stopIndex].media?.[mediaIndex]) {
        toast.error('Media file not found', { id: deleteToast });
        return;
      }
      
      const mediaToRemove = updatedStops[stopIndex].media[mediaIndex];
      
      console.log('Removing media:', {
        stopIndex,
        mediaIndex,
        media: mediaToRemove,
        hasId: !!mediaToRemove.id,
        isNew: !!mediaToRemove.isNew
      });
      
      // Revoke object URL if it exists
      if (mediaToRemove?.temp_url) {
        URL.revokeObjectURL(mediaToRemove.temp_url);
      }
      
      // FIXED: Enhanced removal logic
      if (mediaToRemove?.id) {
        // Existing media with ID - mark for deletion
        updatedStops[stopIndex].media[mediaIndex] = {
          ...mediaToRemove,
          _deleted: true,
          _destroy: true
        };
        console.log('Marked existing media for deletion');
      } else if (mediaToRemove?.isNew) {
        // New media without ID - remove completely
        updatedStops[stopIndex].media.splice(mediaIndex, 1);
        console.log('Completely removed new media');
      } else {
        // Fallback - remove completely
        updatedStops[stopIndex].media.splice(mediaIndex, 1);
        console.log('Fallback removal');
      }
      
      // Force update
      onStopsUpdate(updatedStops);
      
      setTimeout(() => {
        toast.success('Media file removed successfully', { id: deleteToast });
      }, 100);
      
    } catch (error) {
      console.error('Error removing media:', error);
      toast.error('Failed to remove media. Please try again.', { id: deleteToast });
    } finally {
      setIsProcessing(false);
    }
  }, [stops, onStopsUpdate, isEditable]);

  return {
    isProcessing,
    handleMediaAdd,
    handleMediaRemove
  };
};

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * Stop Navigation Component
 */
const StopNavigation = ({ 
  stops, 
  selectedStopIndex, 
  validationWarnings, 
  isProcessing, 
  onStopSelect,
  isEditable 
}) => {
  return (
    <div className="lg:w-1/4">
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <SectionHeader 
          title="Tour Stops"
          subtitle={`Select a stop to ${isEditable ? 'add media' : 'view media'}`}
        />
        
        <div className="p-5 space-y-2">
          {stops.length === 0 ? (
            <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
              <p className="text-sm">No stops available</p>
            </div>
          ) : (
            stops.map((stop, index) => {
              const validation = validationWarnings.filter(w => w.stopIndex === index);
              const hasErrors = validation.some(w => w.severity === 'error');
              const hasWarnings = validation.some(w => w.severity === 'warning');
              
              const nonDeletedMedia = stop.media?.filter(m => !m._deleted && !m._destroy) || [];
              const audioCount = nonDeletedMedia.filter(m => 
                m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO
              ).length;
              
              const imageCount = nonDeletedMedia.filter(m => 
                m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE
              ).length;
              
              return (
                <button
                  key={stop.id || stop.tempId || index}
                  onClick={() => !isProcessing && onStopSelect(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    selectedStopIndex === index
                      ? 'bg-blue-50 border-blue-300'
                      : hasErrors
                      ? 'bg-red-50 border-red-200 hover:border-red-300'
                      : hasWarnings
                      ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isProcessing}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1 space-x-2">
                        <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 truncate">
                          {stop.stop_name || `Stop ${index + 1}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Volume2 size={10} />
                          <span>{audioCount} audio</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ImageIcon size={10} />
                          <span>{imageCount} images</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-2">
                      {hasErrors ? (
                        <AlertTriangle className="text-red-500" size={16} />
                      ) : hasWarnings ? (
                        <AlertTriangle className="text-amber-500" size={16} />
                      ) : (audioCount > 0) ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Content Requirements Summary Component
 */
const ContentRequirementsSummary = ({ validationWarnings, stops }) => {
  return (
    <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
      <SectionHeader title="Content Requirements" />
      
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
                      <strong>{stop?.stop_name || `Stop ${warning.stopIndex + 1}`}:</strong> {warning.message}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <ValidationAlert type="info" title="Content Guidelines">
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>Required:</strong> Every stop must have at least one audio file</li>
                <li>• <strong>Recommended:</strong> Audio duration should be more than 80% of walking time between stops</li>
                <li>• <strong>Note:</strong> Last stop doesn't need walking time validation</li>
              </ul>
            </ValidationAlert>
          </>
        ) : (
          <ValidationAlert 
            type="success"
            message="All stops meet the content requirements"
          />
        )}
      </div>
    </div>
  );
};

/**
 * Audio Guidelines Component
 */
const AudioGuidelines = ({ 
  selectedStopIndex, 
  stops, 
  walkingTimeToNextStop, 
  recommendedAudioTime, 
  totalAudioDuration 
}) => {
  if (selectedStopIndex >= stops.length - 1) {
    return (
      <ValidationAlert type="info" title="Audio Guidelines">
        <div className="mt-2 space-y-1 text-sm">
          <div>This is the final stop - no walking time to next stop</div>
          <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
        </div>
      </ValidationAlert>
    );
  }

  return (
    <ValidationAlert type="info" title="Audio Duration Guidelines">
      <div className="mt-2 space-y-1 text-sm">
        <div>Walking time to next stop: {formatTime(walkingTimeToNextStop)}</div>
        <div>Recommended min audio: {formatTime(recommendedAudioTime)}</div>
        <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
        {totalAudioDuration < recommendedAudioTime && (
          <div className="text-amber-600">
            Consider adding more audio content for better experience
          </div>
        )}
      </div>
    </ValidationAlert>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MediaUploadStep = ({
  stops = [],
  onStopsUpdate,
  onValidationChange,
  isEditable = true
}) => {
  // State
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  
  // Hooks
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();
  const { getMediaWithUrl } = useMediaProcessor();
  const { validationWarnings } = useMediaValidation(stops, getDistanceBetweenPoints, getWalkingTime);
  const { isProcessing, handleMediaAdd, handleMediaRemove } = useMediaOperations(
    stops, 
    onStopsUpdate, 
    isEditable
  );

  // Effects
  useEffect(() => {
    const isValid = !validationWarnings.some(w => w.severity === 'error');
    console.log('Validation result:', { isValid, warnings: validationWarnings });
    onValidationChange?.(isValid);
  }, [validationWarnings, onValidationChange]);

  // Debug effect
  useEffect(() => {
    console.log('Current stops media status:', stops.map((stop, index) => ({
      stop: stop.stop_name,
      mediaCount: stop.media?.length || 0,
      nonDeletedMedia: stop.media?.filter(m => !m._deleted && !m._destroy).length || 0,
      audioFiles: stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted && !m._destroy
      ).length || 0
    })));
  }, [stops]);

  // Current stop data
  const currentStop = stops[selectedStopIndex] || {};

  // Memoized calculations
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

  const totalAudioDuration = useMemo(() => {
    const nonDeletedMedia = (currentStop.media || []).filter(m => !m._deleted && !m._destroy);
    return nonDeletedMedia
      .filter(m => m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO)
      .reduce((total, audio) => total + (audio.duration_seconds || 0), 0);
  }, [currentStop]);

  const mediaWithUrls = useMemo(() => {
    const nonDeletedMedia = (currentStop.media || []).filter(m => !m._deleted && !m._destroy);
    const processedMedia = getMediaWithUrl(nonDeletedMedia);
    console.log('Processed media for display:', processedMedia);
    return processedMedia;
  }, [currentStop.media, getMediaWithUrl]);

  // Event handlers
  const handleStopSelect = (index) => {
    setSelectedStopIndex(index);
  };

  return (
    <div className={`mx-auto ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
        <p className="mt-2 text-gray-600">
          {isEditable 
            ? 'Add audio guides and images for each stop of your tour' 
            : 'View media content for this tour'
          }
        </p>
        {!isEditable && (
          <div className="inline-block px-3 py-1 mt-2 text-sm text-gray-700 bg-gray-100 rounded-full">
            View mode - editing disabled
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <StopNavigation 
          stops={stops}
          selectedStopIndex={selectedStopIndex}
          validationWarnings={validationWarnings}
          isProcessing={isProcessing}
          onStopSelect={handleStopSelect}
          isEditable={isEditable}
        />
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {stops.length === 0 ? (
            <ValidationAlert 
              type="info"
              title="No Stops Available"
              message="Please add stops in the previous step before adding media content."
            />
          ) : (
            <>
              <div className="space-y-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <SectionHeader 
                    title={currentStop.stop_name || `Stop ${selectedStopIndex + 1}`}
                    subtitle={`Stop ${selectedStopIndex + 1} of ${stops.length}`}
                  />
                  
                  <div className="p-5 space-y-6">
                    {currentStop.description && (
                      <p className="text-gray-700">{currentStop.description}</p>
                    )}

                    {/* Audio Guidelines */}
                    <AudioGuidelines 
                      selectedStopIndex={selectedStopIndex}
                      stops={stops}
                      walkingTimeToNextStop={walkingTimeToNextStop}
                      recommendedAudioTime={recommendedAudioTime}
                      totalAudioDuration={totalAudioDuration}
                    />

                    {/* Media Upload */}
                    <MediaUpload
                      media={mediaWithUrls}
                      onMediaAdd={isEditable ? (newMedia) => handleMediaAdd(selectedStopIndex, newMedia) : null}
                      onMediaRemove={isEditable ? (mediaIndex) => handleMediaRemove(selectedStopIndex, mediaIndex) : null}
                      acceptedTypes={['audio/*', 'image/*']}
                      maxFiles={10}
                      isUploading={isProcessing}
                      uploadProgress={0}
                      isEditable={isEditable}
                    />

                    {/* Validation Messages */}
                    <div className="space-y-2">
                      {stopValidation.errors.map((error, index) => (
                        <ValidationAlert
                          key={index}
                          type="error"
                          message={error.message}
                        />
                      ))}
                      {stopValidation.warnings.map((warning, index) => (
                        <ValidationAlert
                          key={index}
                          type="warning"
                          message={warning.message}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Requirements Summary */}
              <ContentRequirementsSummary 
                validationWarnings={validationWarnings}
                stops={stops}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadStep;