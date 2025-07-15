import React, { useState, useEffect } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import { AlertTriangle, CheckCircle, Clock, Volume2, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';
import { useUploadSession } from '../../hooks/useUploadSession';
import { uploadtempmedia, deletetempmedia } from '../../api/tour/tourApi';
import { toast } from 'react-hot-toast';

export const MediaUploadStep = ({
  stops,
  onStopsUpdate
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

  const validateAudioDurations = () => {
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

      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      const totalAudioDuration = audioFiles.reduce((total, audio) => {
        return total + (audio.duration_seconds || 0);
      }, 0);

      if (totalAudioDuration < minRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `Recommended audio duration is (${formatTime(minRecommendedAudioTime)})`,
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

  const handleMediaAdd = async (stopIndex, newMedia) => {
    if (!sessionId) {
      console.error('No session ID found');
      toast.error('Upload service is initializing. Please try again in a moment.');
      return;
    }

    const uploadToast = toast.loading('Uploading media files...');
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedKeys = [];
    
    try {
      const updatedStops = [...stops];
      const currentMedia = updatedStops[stopIndex].media || [];
      
      updatedStops[stopIndex] = {
        ...updatedStops[stopIndex],
        media: [
          ...currentMedia,
          ...newMedia.map(file => ({
            ...file,
            isUploading: true,
            tempUrl: file.format.startsWith('audio/') ? null : URL.createObjectURL(file.file)
          }))
        ]
      };
      onStopsUpdate(updatedStops);

      const uploadPromises = newMedia.map(async (media) => {
        const formData = new FormData();
        formData.append('file', media.file);
        formData.append('type', media.format.startsWith('audio/') ? 'stop_audio' : 'stop_image');
        formData.append('sessionId', sessionId);
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
        
        // Store the uploaded key for potential cleanup
        uploadedKeys.push(response.key);
        
        let duration = 0;
        if (media.format.startsWith('audio/')) {
          duration = await getAudioDuration(media.file);
        }

        return {
          ...response,
          media_type: media.format.startsWith('audio/') ? 'audio' : 'image',
          duration_seconds: duration,
          tempUrl: media.format.startsWith('image/') ? URL.createObjectURL(media.file) : null
        };
      });

      const uploadedMedia = await Promise.all(uploadPromises);

      const finalUpdatedStops = [...stops];
      const finalMedia = finalUpdatedStops[stopIndex].media || [];
      
      finalUpdatedStops[stopIndex] = {
        ...finalUpdatedStops[stopIndex],
        media: [
          ...finalMedia.filter(m => !m.isUploading),
          ...uploadedMedia
        ]
      };

      onStopsUpdate(finalUpdatedStops);
      toast.success('Media files uploaded successfully!', { id: uploadToast });
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed. Please try again.';
      toast.error(errorMessage, { id: uploadToast });
      
      // Clean up any successfully uploaded files
      if (uploadedKeys.length > 0) {
        try {
          await Promise.all(uploadedKeys.map(key => deletetempmedia(key)));
          console.log('Cleaned up uploaded files due to error');
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }
      
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
  };

  const handleMediaRemove = async (stopIndex, mediaIndex) => {
    const deleteToast = toast.loading('Removing media file...');
    const updatedStops = [...stops];
    const currentMedia = updatedStops[stopIndex].media || [];
    const removedMedia = currentMedia[mediaIndex];
    
    try {
      setIsUploading(true);
      
      currentMedia.splice(mediaIndex, 1);
      updatedStops[stopIndex] = {
        ...updatedStops[stopIndex],
        media: currentMedia
      };
      onStopsUpdate(updatedStops);

      if (removedMedia.key) {
        await deletetempmedia(removedMedia.key);
      }
      
      if (removedMedia.tempUrl) {
        URL.revokeObjectURL(removedMedia.tempUrl);
      }
      
      toast.success('Media file removed successfully', { id: deleteToast });
    } catch (error) {
      console.error('Error deleting media:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete media. Please try again.';
      toast.error(errorMessage, { id: deleteToast });
      // Revert if deletion fails
      const originalStops = [...stops];
      onStopsUpdate(originalStops);
    } finally {
      setIsUploading(false);
    }
  };
  const getAudioDuration = (file) => {
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
    <div className={`mx-auto ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
        <p className="mt-2 text-gray-600">Add audio guides and images for each stop of your tour</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column - Stop Navigation */}
        <div className="lg:w-1/4">
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="font-medium text-gray-800">Tour Stops</h3>
              <p className="mt-1 text-sm text-gray-600">Select a stop to add media</p>
            </div>
            
            <div className="p-5 space-y-2">
              {stops.map((stop, index) => {
                const validation = getStopValidation(index);
                return (
                  <button
                    key={stop.tempId || stop.id}
                    onClick={() => !isUploading && setSelectedStopIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative ${
                      selectedStopIndex === index
                        ? 'bg-blue-100 border border-blue-300'
                        : validation.hasIssues
                        ? 'bg-red-50 border border-red-200 hover:border-red-300'
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
        </div>

        {/* Right Column - Media Upload Area */}
        <div className="lg:w-3/4">
          {stops.length === 0 ? (
            <div className="p-6 text-center border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-600">No stops available. Please add stops in the previous step.</p>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    {stops[selectedStopIndex]?.stop_name || `Stop ${selectedStopIndex + 1}`}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Stop {selectedStopIndex + 1} of {stops.length}
                  </div>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {stops[selectedStopIndex]?.description && (
                  <p className="text-gray-700">
                    {stops[selectedStopIndex].description}
                  </p>
                )}

                {/* Audio Duration Guidelines */}
                {selectedStopIndex < stops.length - 1 && (
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start space-x-2">
                      <Clock className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h4 className="font-medium text-blue-900">Audio Duration Guidelines</h4>
                        <div className="mt-1 space-y-1 text-sm text-blue-800">
                          <div>Walking time to next stop: {formatTime(getWalkingTimeBetweenStops(selectedStopIndex, selectedStopIndex + 1))}</div>
                          <div>Recommended min audio: {formatTime(getRecommendedAudioTime(selectedStopIndex) || 0)}</div>
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
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />

                {(() => {
                  const validation = getStopValidation(selectedStopIndex);
                  return (
                    <div className="space-y-2">
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

          {validationWarnings.length > 0 && (
            <div className="mt-6 overflow-hidden border border-gray-200 rounded-xl">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
                <h3 className="font-medium text-gray-800">Validation Summary</h3>
              </div>
              
              <div className="p-5 space-y-4">
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
                    <li>• <strong>Audio Duration Rule:</strong> Keep audio content more than 80% of walking time between stops</li>
                    <li>• <strong>Content Guidelines:</strong> Each stop should have at least one audio file</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};