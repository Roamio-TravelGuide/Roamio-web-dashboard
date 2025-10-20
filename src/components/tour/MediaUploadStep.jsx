// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { MediaUpload } from '../ui/MediaUpload';
// import LoadingSpinner from '../ui/LoadingSpinner';
// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Volume2, 
//   Image as ImageIcon 
// } from 'lucide-react';
// import { useMapbox } from '../../hooks/useMaps';
// import { toast } from 'react-hot-toast';
// import { ValidationAlert, SectionHeader } from './common';
// import { formatTime, getAudioDuration } from '../../utils/tourUtils';
// import { TOUR_CONSTANTS, VALIDATION_MESSAGES } from '../../utils/tourConstants';
// import { getMediaUrl } from '../../utils/constants';

// // =============================================================================
// // CUSTOM HOOKS
// // =============================================================================

// /**
//  * Hook for media URL and name processing
//  */
// const useMediaProcessor = () => {
//   const getMediaWithUrl = useCallback((mediaArray) => {
//     if (!mediaArray || !Array.isArray(mediaArray)) return [];
    
//     return mediaArray.map(mediaItem => {
//       const mediaWithUrl = { ...mediaItem };
      
//       // Handle URLs - fix URL generation
//       if (mediaItem.temp_url) {
//         mediaWithUrl.display_url = mediaItem.temp_url;
//       } else if (mediaItem.url) {
//         mediaWithUrl.display_url = getMediaUrl(mediaItem.url);
//       } else if (mediaItem.file_url) {
//         mediaWithUrl.display_url = getMediaUrl(mediaItem.file_url);
//       }
      
//       // FIXED: Better file name generation
//       let displayName = 'Unknown file';
      
//       // For new files with file object
//       if (mediaItem.file && mediaItem.file.name) {
//         displayName = mediaItem.file.name;
//       }
//       // For existing files from API
//       else if (mediaItem.original_name) {
//         displayName = mediaItem.original_name;
//       }
//       else if (mediaItem.file_name) {
//         // Convert "file_36" to descriptive name
//         const fileExt = mediaItem.file_type?.split('/')[1] || 
//                        (mediaItem.file_name.includes('.') 
//                         ? mediaItem.file_name.split('.').pop() 
//                         : 'file');
        
//         if (mediaItem.media_type === 'audio') {
//           displayName = `Audio recording_${mediaItem.id || 'new'}.${fileExt}`;
//         } else if (mediaItem.media_type === 'image') {
//           displayName = `Tour image_${mediaItem.id || 'new'}.${fileExt}`;
//         } else {
//           displayName = mediaItem.file_name;
//         }
//       }
//       else if (mediaItem.name) {
//         displayName = mediaItem.name;
//       }
//       // Final fallback
//       else if (mediaItem.media_type === 'audio') {
//         displayName = `Audio recording_${mediaItem.id || 'new'}.mp3`;
//       } else if (mediaItem.media_type === 'image') {
//         displayName = `Tour image_${mediaItem.id || 'new'}.jpg`;
//       }
      
//       // Set name properties
//       mediaWithUrl.display_name = displayName;
//       mediaWithUrl.name = mediaItem.name || displayName;
//       mediaWithUrl.original_name = mediaItem.original_name || displayName;
      
//       return mediaWithUrl;
//     });
//   }, []);

//   return { getMediaWithUrl };
// };

// /**
//  * Hook for validation logic
//  */
// const useMediaValidation = (stops, getDistanceBetweenPoints, getWalkingTime) => {
//   const validationWarnings = useMemo(() => {
//     const warnings = [];

//     stops.forEach((stop, index) => {
//       // FIXED: Check ALL stops for audio requirement, not just non-last stops
//       const nonDeletedMedia = stop.media?.filter(m => !m._deleted && !m._destroy) || [];
//       const audioFiles = nonDeletedMedia.filter(m => 
//         m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO
//       );

//       // REQUIRED: Every stop must have at least one audio file
//       if (audioFiles.length === 0) {
//         warnings.push({
//           stopIndex: index,
//           message: VALIDATION_MESSAGES.REQUIRED_AUDIO,
//           severity: 'error'
//         });
//       }

//       // Only check duration for non-last stops
//       if (index < stops.length - 1) {
//         const nextStop = stops[index + 1];
//         if (!stop.location || !nextStop.location) return;

//         // Calculate distance and walking time
//         const distance = getDistanceBetweenPoints(
//           { lat: stop.location.latitude, lng: stop.location.longitude },
//           { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
//         );

//         const walkingTime = getWalkingTime(distance);
//         const minRecommendedAudioTime = Math.floor(walkingTime * 0.8);
        
//         const totalAudioDuration = audioFiles.reduce(
//           (total, audio) => total + (audio.duration_seconds || 0), 0
//         );

//         // Recommended validation - audio duration should be sufficient
//         if (audioFiles.length > 0 && totalAudioDuration < minRecommendedAudioTime) {
//           warnings.push({
//             stopIndex: index,
//             message: `${VALIDATION_MESSAGES.INSUFFICIENT_AUDIO} ${formatTime(minRecommendedAudioTime)} (${formatTime(totalAudioDuration)} currently)`,
//             severity: 'warning'
//           });
//         }
//       }
//     });

//     console.log('Validation warnings:', warnings);
//     return warnings;
//   }, [stops, getDistanceBetweenPoints, getWalkingTime]);

//   return { validationWarnings };
// };

// /**
//  * Hook for media operations (add/remove)
//  */
// const useMediaOperations = (stops, onStopsUpdate, isEditable) => {
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleMediaAdd = useCallback(async (stopIndex, newMedia) => {
//     if (!isEditable) return;
    
//     const processToast = toast.loading('Processing media files...');
//     setIsProcessing(true);
    
//     try {
//       const updatedStops = [...stops];
//       const processedMedia = await Promise.all(
//         newMedia.map(async (fileObj) => {
//           const duration = fileObj.file.type.startsWith('audio/') 
//             ? await getAudioDuration(fileObj.file) 
//             : 0;

//           const tempUrl = fileObj.file.type.startsWith('image/') 
//             ? URL.createObjectURL(fileObj.file) 
//             : null;

//           return {
//             file: fileObj.file,
//             media_type: fileObj.file.type.startsWith('audio/') 
//               ? TOUR_CONSTANTS.MEDIA_TYPES.AUDIO 
//               : TOUR_CONSTANTS.MEDIA_TYPES.IMAGE,
//             duration_seconds: duration,
//             file_name: fileObj.file.name,
//             original_name: fileObj.file.name, // Ensure original_name is set
//             file_type: fileObj.file.type,
//             file_size: fileObj.file.size,
//             temp_url: tempUrl,
//             isNew: true,
//             display_url: tempUrl
//           };
//         })
//       );

//       updatedStops[stopIndex] = {
//         ...updatedStops[stopIndex],
//         media: [
//           ...(updatedStops[stopIndex].media || []),
//           ...processedMedia
//         ]
//       };

//       onStopsUpdate(updatedStops);
//       toast.success('Media files processed successfully!', { id: processToast });
//     } catch (error) {
//       console.error('Processing failed:', error);
//       toast.error('Failed to process media files. Please try again.', { id: processToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [stops, onStopsUpdate, isEditable]);

//   const handleMediaRemove = useCallback(async (stopIndex, mediaIndex) => {
//     if (!isEditable) return;
    
//     const deleteToast = toast.loading('Removing media file...');
    
//     try {
//       setIsProcessing(true);
      
//       // Create deep copy to ensure React detects changes
//       const updatedStops = JSON.parse(JSON.stringify(stops));
      
//       // Validate indices
//       if (!updatedStops[stopIndex] || !updatedStops[stopIndex].media?.[mediaIndex]) {
//         toast.error('Media file not found', { id: deleteToast });
//         return;
//       }
      
//       const mediaToRemove = updatedStops[stopIndex].media[mediaIndex];
      
//       console.log('Removing media:', {
//         stopIndex,
//         mediaIndex,
//         media: mediaToRemove,
//         hasId: !!mediaToRemove.id,
//         isNew: !!mediaToRemove.isNew
//       });
      
//       // Revoke object URL if it exists
//       if (mediaToRemove?.temp_url) {
//         URL.revokeObjectURL(mediaToRemove.temp_url);
//       }
      
//       // FIXED: Enhanced removal logic
//       if (mediaToRemove?.id) {
//         // Existing media with ID - mark for deletion
//         updatedStops[stopIndex].media[mediaIndex] = {
//           ...mediaToRemove,
//           _deleted: true,
//           _destroy: true
//         };
//         console.log('Marked existing media for deletion');
//       } else if (mediaToRemove?.isNew) {
//         // New media without ID - remove completely
//         updatedStops[stopIndex].media.splice(mediaIndex, 1);
//         console.log('Completely removed new media');
//       } else {
//         // Fallback - remove completely
//         updatedStops[stopIndex].media.splice(mediaIndex, 1);
//         console.log('Fallback removal');
//       }
      
//       // Force update
//       onStopsUpdate(updatedStops);
      
//       setTimeout(() => {
//         toast.success('Media file removed successfully', { id: deleteToast });
//       }, 100);
      
//     } catch (error) {
//       console.error('Error removing media:', error);
//       toast.error('Failed to remove media. Please try again.', { id: deleteToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [stops, onStopsUpdate, isEditable]);

//   return {
//     isProcessing,
//     handleMediaAdd,
//     handleMediaRemove
//   };
// };

// // =============================================================================
// // COMPONENTS
// // =============================================================================

// /**
//  * Stop Navigation Component
//  */
// const StopNavigation = ({ 
//   stops, 
//   selectedStopIndex, 
//   validationWarnings, 
//   isProcessing, 
//   onStopSelect,
//   isEditable 
// }) => {
//   return (
//     <div className="lg:w-1/4">
//       <div className="overflow-hidden border border-gray-200 rounded-lg">
//         <SectionHeader 
//           title="Tour Stops"
//           subtitle={`Select a stop to ${isEditable ? 'add media' : 'view media'}`}
//         />
        
//         <div className="p-5 space-y-2">
//           {stops.length === 0 ? (
//             <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
//               <p className="text-sm">No stops available</p>
//             </div>
//           ) : (
//             stops.map((stop, index) => {
//               const validation = validationWarnings.filter(w => w.stopIndex === index);
//               const hasErrors = validation.some(w => w.severity === 'error');
//               const hasWarnings = validation.some(w => w.severity === 'warning');
              
//               const nonDeletedMedia = stop.media?.filter(m => !m._deleted && !m._destroy) || [];
//               const audioCount = nonDeletedMedia.filter(m => 
//                 m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO
//               ).length;
              
//               const imageCount = nonDeletedMedia.filter(m => 
//                 m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE
//               ).length;
              
//               return (
//                 <button
//                   key={stop.id || stop.tempId || index}
//                   onClick={() => !isProcessing && onStopSelect(index)}
//                   className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
//                     selectedStopIndex === index
//                       ? 'bg-blue-50 border-blue-300'
//                       : hasErrors
//                       ? 'bg-red-50 border-red-200 hover:border-red-300'
//                       : hasWarnings
//                       ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
//                       : 'border-gray-200 hover:border-gray-300'
//                   } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
//                   disabled={isProcessing}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center mb-1 space-x-2">
//                         <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
//                           {index + 1}
//                         </span>
//                         <span className="font-medium text-gray-900 truncate">
//                           {stop.stop_name || `Stop ${index + 1}`}
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center space-x-3 text-xs text-gray-500">
//                         <div className="flex items-center space-x-1">
//                           <Volume2 size={10} />
//                           <span>{audioCount} audio</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <ImageIcon size={10} />
//                           <span>{imageCount} images</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex-shrink-0 ml-2">
//                       {hasErrors ? (
//                         <AlertTriangle className="text-red-500" size={16} />
//                       ) : hasWarnings ? (
//                         <AlertTriangle className="text-amber-500" size={16} />
//                       ) : (audioCount > 0) ? (
//                         <CheckCircle className="text-green-500" size={16} />
//                       ) : null}
//                     </div>
//                   </div>
//                 </button>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /**
//  * Content Requirements Summary Component
//  */
// const ContentRequirementsSummary = ({ validationWarnings, stops }) => {
//   return (
//     <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
//       <SectionHeader title="Content Requirements" />
      
//       <div className="p-5 space-y-4">
//         {validationWarnings.length > 0 ? (
//           <>
//             <div className="space-y-2">
//               {validationWarnings.map((warning, index) => {
//                 const stop = stops[warning.stopIndex];
//                 return (
//                   <div key={index} className="flex items-start space-x-2 text-sm">
//                     <AlertTriangle 
//                       className={warning.severity === 'error' ? 'text-red-500' : 'text-amber-500'} 
//                       size={14} 
//                     />
//                     <span className="text-gray-700">
//                       <strong>{stop?.stop_name || `Stop ${warning.stopIndex + 1}`}:</strong> {warning.message}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <ValidationAlert type="info" title="Content Guidelines">
//               <ul className="mt-2 space-y-1 text-sm">
//                 <li>• <strong>Required:</strong> Every stop must have at least one audio file</li>
//                 <li>• <strong>Recommended:</strong> Audio duration should be more than 80% of walking time between stops</li>
//                 <li>• <strong>Note:</strong> Last stop doesn't need walking time validation</li>
//               </ul>
//             </ValidationAlert>
//           </>
//         ) : (
//           <ValidationAlert 
//             type="success"
//             message="All stops meet the content requirements"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// /**
//  * Audio Guidelines Component
//  */
// const AudioGuidelines = ({ 
//   selectedStopIndex, 
//   stops, 
//   walkingTimeToNextStop, 
//   recommendedAudioTime, 
//   totalAudioDuration 
// }) => {
//   if (selectedStopIndex >= stops.length - 1) {
//     return (
//       <ValidationAlert type="info" title="Audio Guidelines">
//         <div className="mt-2 space-y-1 text-sm">
//           <div>This is the final stop - no walking time to next stop</div>
//           <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
//         </div>
//       </ValidationAlert>
//     );
//   }

//   return (
//     <ValidationAlert type="info" title="Audio Duration Guidelines">
//       <div className="mt-2 space-y-1 text-sm">
//         <div>Walking time to next stop: {formatTime(walkingTimeToNextStop)}</div>
//         <div>Recommended min audio: {formatTime(recommendedAudioTime)}</div>
//         <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
//         {totalAudioDuration < recommendedAudioTime && (
//           <div className="text-amber-600">
//             Consider adding more audio content for better experience
//           </div>
//         )}
//       </div>
//     </ValidationAlert>
//   );
// };

// // =============================================================================
// // MAIN COMPONENT
// // =============================================================================

// export const MediaUploadStep = ({
//   stops = [],
//   onStopsUpdate,
//   onValidationChange,
//   isEditable = true
// }) => {
//   // State
//   const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  
//   // Hooks
//   const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();
//   const { getMediaWithUrl } = useMediaProcessor();
//   const { validationWarnings } = useMediaValidation(stops, getDistanceBetweenPoints, getWalkingTime);
//   const { isProcessing, handleMediaAdd, handleMediaRemove } = useMediaOperations(
//     stops, 
//     onStopsUpdate, 
//     isEditable
//   );

//   // Effects
//   useEffect(() => {
//     const isValid = !validationWarnings.some(w => w.severity === 'error');
//     console.log('Validation result:', { isValid, warnings: validationWarnings });
//     onValidationChange?.(isValid);
//   }, [validationWarnings, onValidationChange]);

//   // Debug effect
//   useEffect(() => {
//     console.log('Current stops media status:', stops.map((stop, index) => ({
//       stop: stop.stop_name,
//       mediaCount: stop.media?.length || 0,
//       nonDeletedMedia: stop.media?.filter(m => !m._deleted && !m._destroy).length || 0,
//       audioFiles: stop.media?.filter(m => 
//         m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted && !m._destroy
//       ).length || 0
//     })));
//   }, [stops]);

//   // Current stop data
//   const currentStop = stops[selectedStopIndex] || {};

//   // Memoized calculations
//   const stopValidation = useMemo(() => {
//     const errors = validationWarnings.filter(w => 
//       w.stopIndex === selectedStopIndex && w.severity === 'error'
//     );
//     const warnings = validationWarnings.filter(w => 
//       w.stopIndex === selectedStopIndex && w.severity === 'warning'
//     );
    
//     return { errors, warnings, hasIssues: errors.length > 0 || warnings.length > 0 };
//   }, [validationWarnings, selectedStopIndex]);

//   const walkingTimeToNextStop = useMemo(() => {
//     if (selectedStopIndex >= stops.length - 1) return 0;
//     const fromStop = stops[selectedStopIndex];
//     const toStop = stops[selectedStopIndex + 1];
    
//     if (!fromStop.location || !toStop.location) return 0;
    
//     const distance = getDistanceBetweenPoints(
//       { lat: fromStop.location.latitude, lng: fromStop.location.longitude },
//       { lat: toStop.location.latitude, lng: toStop.location.longitude }
//     );
    
//     return getWalkingTime(distance);
//   }, [selectedStopIndex, stops, getDistanceBetweenPoints, getWalkingTime]);

//   const recommendedAudioTime = useMemo(() => 
//     Math.floor(walkingTimeToNextStop * 0.8), 
//     [walkingTimeToNextStop]
//   );

//   const totalAudioDuration = useMemo(() => {
//     const nonDeletedMedia = (currentStop.media || []).filter(m => !m._deleted && !m._destroy);
//     return nonDeletedMedia
//       .filter(m => m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO)
//       .reduce((total, audio) => total + (audio.duration_seconds || 0), 0);
//   }, [currentStop]);

//   const mediaWithUrls = useMemo(() => {
//     const nonDeletedMedia = (currentStop.media || []).filter(m => !m._deleted && !m._destroy);
//     const processedMedia = getMediaWithUrl(nonDeletedMedia);
//     console.log('Processed media for display:', processedMedia);
//     return processedMedia;
//   }, [currentStop.media, getMediaWithUrl]);

//   // Event handlers
//   const handleStopSelect = (index) => {
//     setSelectedStopIndex(index);
//   };

//   return (
//     <div className={`mx-auto ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}>
//       {/* Header */}
//       <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
//         <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
//         <p className="mt-2 text-gray-600">
//           {isEditable 
//             ? 'Add audio guides and images for each stop of your tour' 
//             : 'View media content for this tour'
//           }
//         </p>
//         {!isEditable && (
//           <div className="inline-block px-3 py-1 mt-2 text-sm text-gray-700 bg-gray-100 rounded-full">
//             View mode - editing disabled
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col gap-6 lg:flex-row">
//         <StopNavigation 
//           stops={stops}
//           selectedStopIndex={selectedStopIndex}
//           validationWarnings={validationWarnings}
//           isProcessing={isProcessing}
//           onStopSelect={handleStopSelect}
//           isEditable={isEditable}
//         />
        
//         {/* Main Content */}
//         <div className="lg:w-3/4">
//           {stops.length === 0 ? (
//             <ValidationAlert 
//               type="info"
//               title="No Stops Available"
//               message="Please add stops in the previous step before adding media content."
//             />
//           ) : (
//             <>
//               <div className="space-y-6">
//                 <div className="overflow-hidden border border-gray-200 rounded-lg">
//                   <SectionHeader 
//                     title={currentStop.stop_name || `Stop ${selectedStopIndex + 1}`}
//                     subtitle={`Stop ${selectedStopIndex + 1} of ${stops.length}`}
//                   />
                  
//                   <div className="p-5 space-y-6">
//                     {currentStop.description && (
//                       <p className="text-gray-700">{currentStop.description}</p>
//                     )}

//                     {/* Audio Guidelines */}
//                     <AudioGuidelines 
//                       selectedStopIndex={selectedStopIndex}
//                       stops={stops}
//                       walkingTimeToNextStop={walkingTimeToNextStop}
//                       recommendedAudioTime={recommendedAudioTime}
//                       totalAudioDuration={totalAudioDuration}
//                     />

//                     {/* Media Upload */}
//                     <MediaUpload
//                       media={mediaWithUrls}
//                       onMediaAdd={isEditable ? (newMedia) => handleMediaAdd(selectedStopIndex, newMedia) : null}
//                       onMediaRemove={isEditable ? (mediaIndex) => handleMediaRemove(selectedStopIndex, mediaIndex) : null}
//                       acceptedTypes={['audio/*', 'image/*']}
//                       maxFiles={10}
//                       isUploading={isProcessing}
//                       uploadProgress={0}
//                       isEditable={isEditable}
//                     />

//                     {/* Validation Messages */}
//                     <div className="space-y-2">
//                       {stopValidation.errors.map((error, index) => (
//                         <ValidationAlert
//                           key={index}
//                           type="error"
//                           message={error.message}
//                         />
//                       ))}
//                       {stopValidation.warnings.map((warning, index) => (
//                         <ValidationAlert
//                           key={index}
//                           type="warning"
//                           message={warning.message}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Requirements Summary */}
//               <ContentRequirementsSummary 
//                 validationWarnings={validationWarnings}
//                 stops={stops}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaUploadStep;

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Image as ImageIcon,
  Play,
  Pause,
  VolumeX,
  Volume1,
  Settings,
  Headphones,
  Eye,
  X,
  Download,
  ZoomIn
} from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';
import { toast } from 'react-hot-toast';
import { ValidationAlert, SectionHeader } from './common';
import { formatTime, getAudioDuration } from '../../utils/tourUtils';
import { TOUR_CONSTANTS, VALIDATION_MESSAGES } from '../../utils/tourConstants';
import { getMediaUrl } from '../../utils/constants';

// =============================================================================
// IMAGE PREVIEW MODAL
// =============================================================================

const ImagePreviewModal = ({ imageUrl, imageName, onClose }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
      <div className="relative max-w-6xl max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white truncate max-w-md">
            {imageName || 'Image Preview'}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close image preview"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
        <img 
          src={imageUrl} 
          alt="Full size preview"
          className="object-contain max-w-full max-h-[70vh] rounded-lg"
          loading="eager"
        />
        <div className="flex justify-center mt-4 space-x-4">
          <a
            href={imageUrl}
            download={imageName || 'tour-image'}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// AUDIO PLAYER COMPONENT (Fixed)
// =============================================================================

const AudioPlayer = React.memo(({ 
  media, 
  isPlaying, 
  onPlay, 
  onPause, 
  currentTime, 
  duration, 
  volume, 
  onVolumeChange, 
  playbackRate, 
  onPlaybackRateChange,
  onSeek
}) => {
  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    if (duration > 0 && onSeek) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      onSeek(newTime);
    }
  };

  // Get the actual audio URL for playback
  const getAudioUrl = () => {
    return media.display_url || media.temp_url || media.url || media.file_url;
  };

  const audioUrl = getAudioUrl();

  return (
    <div className="overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Headphones className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {media.display_name || media.original_name || `Audio #${media.id}`}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {media.format?.toUpperCase() || 'AUDIO'} • {formatTime(media.duration_seconds)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3">
          {/* Compact Progress Position Indicator */}
          <div className="relative w-full h-1 mb-1">
            <div className="absolute w-full h-0.5 bg-gray-200 top-0"></div>
            <div 
              className={`absolute w-0.5 h-1 transform -translate-x-1/2 transition-all duration-100 ${
                isPlaying 
                  ? 'bg-red-500 shadow-sm' 
                  : 'bg-blue-600'
              }`}
              style={{ left: `${progressPercentage}%` }}
            />
          </div>

          {/* Compact Main Progress Bar */}
          <div 
            className="relative w-full h-3 overflow-visible bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            {/* Progress fill */}
            <div 
              className="absolute top-0 left-0 h-full transition-all duration-100 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Small, visible progress dot */}
            <div 
              className={`absolute top-1/2 w-4 h-4 border-2 border-white rounded-full shadow-md transform -translate-y-1/2 transition-all duration-100 ${
                isPlaying 
                  ? 'bg-red-500 scale-110' 
                  : 'bg-blue-600'
              }`}
              style={{ left: `${Math.max(1, Math.min(progressPercentage, 97))}%` }}
            />
          </div>
          
          {/* Compact time display */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className={`font-medium ${isPlaying ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(currentTime)}
            </span>
            <span className="text-gray-500">
              {formatTime(duration || media.duration_seconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => audioUrl ? (isPlaying ? onPause() : onPlay()) : toast.error('Audio URL not available')}
              disabled={!audioUrl}
              className={`flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                audioUrl 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            
            <div className="flex items-center space-x-1">
              <Settings className="w-3 h-3 text-gray-400" />
              <select
                value={playbackRate}
                onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
                className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Playback speed"
                disabled={!audioUrl}
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <option key={speed} value={speed}>{speed}x</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              aria-label={volume > 0 ? 'Mute' : 'Unmute'}
              disabled={!audioUrl}
            >
              {volume === 0 ? (
                <VolumeX className="w-3 h-3 text-gray-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-3 h-3 text-gray-400" />
              ) : (
                <Volume2 className="w-3 h-3 text-gray-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
              aria-label="Volume control"
              disabled={!audioUrl}
            />
          </div>
        </div>

        {!audioUrl && (
          <div className="p-2 mt-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">
            Audio file not available for playback
          </div>
        )}
      </div>
    </div>
  );
});

// =============================================================================
// IMAGE GALLERY COMPONENT
// =============================================================================

const ImageGallery = React.memo(({ images, onImageClick }) => {
  if (!images?.length) {
    return (
      <div className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="relative p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-green-100 to-blue-100">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">No Images Available</h3>
          <p className="text-xs leading-relaxed text-gray-600">
            This stop doesn't have any images yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => (
        <div
          key={`${image.id}-${index}-${image.temp_url}`}
          className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer group hover:shadow-md"
          onClick={() => onImageClick(image.display_url || image.temp_url || image.url, image.display_name || image.original_name)}
        >
          <div className="relative h-32 overflow-hidden">
            <img 
              src={image.display_url || image.temp_url || image.url} 
              alt={`Stop image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
              }}
            />
            
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100" />
            
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button 
                  className="p-2 transition-colors rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  aria-label="Preview image"
                >
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button 
                  className="p-2 transition-colors rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-900 truncate">
                {image.display_name || image.original_name || `Image #${image.id || index + 1}`}
              </span>
              <span className="text-xs text-gray-500">
                #{index + 1}
              </span>
            </div>
            
            {image.file_size && (
              <p className="text-xs text-gray-500 mt-1">
                {(image.file_size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Hook for audio playback functionality
 */
const useAudioPlayback = () => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const newCurrentTime = audio.currentTime;
      setCurrentTime(newCurrentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setPlayingAudio(null);
      setCurrentTime(0);
    };
    
    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setPlayingAudio(null);
      toast.error('Failed to play audio file');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playingAudio]);

  // Update audio volume and playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const handlePlayAudio = useCallback((mediaId, audioUrl) => {
    console.debug('handlePlayAudio called', { mediaId, audioUrl });
    
    if (!audioUrl) {
      toast.error('Audio URL not available');
      return;
    }

    try {
      if (playingAudio === mediaId) {
        // Pause currently playing audio
        audioRef.current?.pause();
        setPlayingAudio(null);
      } else {
        // Stop any currently playing audio
        if (playingAudio) {
          audioRef.current?.pause();
        }

        // Set new audio source and play
        setPlayingAudio(mediaId);
        setCurrentTime(0);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.currentTime = 0;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Audio play failed:', error);
              toast.error('Failed to play audio file');
              setPlayingAudio(null);
            });
          }
        }
      }
    } catch (error) {
      console.error('Error handling audio play:', error);
      toast.error('Audio playback error');
      setPlayingAudio(null);
    }
  }, [playingAudio]);

  const handlePauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setPlayingAudio(null);
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
  }, []);

  const handlePlaybackRateChange = useCallback((newRate) => {
    setPlaybackRate(newRate);
  }, []);

  const handleSeek = useCallback((newTime) => {
    if (audioRef.current && !isNaN(newTime)) {
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration || audioRef.current.duration));
      setCurrentTime(newTime);
    }
  }, [duration]);

  return {
    playingAudio,
    currentTime,
    duration,
    volume,
    playbackRate,
    audioRef,
    handlePlayAudio,
    handlePauseAudio,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleSeek
  };
};

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
        mediaWithUrl.playback_url = mediaItem.temp_url; // For audio playback
      } else if (mediaItem.url) {
        mediaWithUrl.display_url = getMediaUrl(mediaItem.url);
        mediaWithUrl.playback_url = getMediaUrl(mediaItem.url);
      } else if (mediaItem.file_url) {
        mediaWithUrl.display_url = getMediaUrl(mediaItem.file_url);
        mediaWithUrl.playback_url = getMediaUrl(mediaItem.file_url);
      } else if (mediaItem.file && mediaItem.file.type.startsWith('audio/')) {
        // Create object URL for new audio files
        try {
          const objectUrl = URL.createObjectURL(mediaItem.file);
          mediaWithUrl.temp_url = objectUrl;
          mediaWithUrl.display_url = objectUrl;
          mediaWithUrl.playback_url = objectUrl;
        } catch (error) {
          console.error('Error creating object URL for audio:', error);
        }
      } else if (mediaItem.file && mediaItem.file.type.startsWith('image/')) {
        // Create object URL for new image files
        try {
          const objectUrl = URL.createObjectURL(mediaItem.file);
          mediaWithUrl.temp_url = objectUrl;
          mediaWithUrl.display_url = objectUrl;
        } catch (error) {
          console.error('Error creating object URL for image:', error);
        }
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

// ... (rest of the hooks remain the same - useMediaValidation, useMediaOperations)

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

          // Create object URLs for immediate playback/preview
          let tempUrl = null;
          try {
            tempUrl = URL.createObjectURL(fileObj.file);
          } catch (error) {
            console.error('Error creating object URL:', error);
          }

          return {
            file: fileObj.file,
            media_type: fileObj.file.type.startsWith('audio/') 
              ? TOUR_CONSTANTS.MEDIA_TYPES.AUDIO 
              : TOUR_CONSTANTS.MEDIA_TYPES.IMAGE,
            duration_seconds: duration,
            file_name: fileObj.file.name,
            original_name: fileObj.file.name,
            file_type: fileObj.file.type,
            file_size: fileObj.file.size,
            temp_url: tempUrl,
            display_url: tempUrl,
            playback_url: tempUrl,
            isNew: true
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
// COMPONENTS (StopNavigation, ContentRequirementsSummary, AudioGuidelines remain the same)
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', name: '' });
  
  // Hooks
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();
  const { getMediaWithUrl } = useMediaProcessor();
  const { validationWarnings } = useMediaValidation(stops, getDistanceBetweenPoints, getWalkingTime);
  const { isProcessing, handleMediaAdd, handleMediaRemove } = useMediaOperations(
    stops, 
    onStopsUpdate, 
    isEditable
  );

  // Audio playback hook
  const {
    playingAudio,
    currentTime,
    duration,
    volume,
    playbackRate,
    audioRef,
    handlePlayAudio,
    handlePauseAudio,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleSeek
  } = useAudioPlayback();

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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup any object URLs when component unmounts
      stops.forEach(stop => {
        stop.media?.forEach(media => {
          if (media.temp_url && media.isNew) {
            URL.revokeObjectURL(media.temp_url);
          }
        });
      });
    };
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

  // Separate audio and image media
  const audioMedia = useMemo(() => 
    mediaWithUrls.filter(m => m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO),
    [mediaWithUrls]
  );

  const imageMedia = useMemo(() => 
    mediaWithUrls.filter(m => m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE),
    [mediaWithUrls]
  );

  // Event handlers
  const handleStopSelect = (index) => {
    setSelectedStopIndex(index);
  };

  const handleImageClick = (imageUrl, imageName) => {
    setSelectedImage({ url: imageUrl, name: imageName });
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage({ url: '', name: '' });
  };

  return (
    <div className={`mx-auto ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
        <p className="mt-2 text-gray-600">
          {isEditable 
            ? 'Add audio guides and images for each stop of your tour. You can play audio files and preview images immediately after upload.' 
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

                    {/* Audio Player Section */}
                    {audioMedia.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Headphones className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-semibold text-gray-900">Audio Narration</h4>
                          <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                            {audioMedia.length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {audioMedia.map((audio, index) => (
                            <AudioPlayer
                              key={audio.id || audio.temp_url || `audio-${index}`}
                              media={audio}
                              isPlaying={playingAudio === (audio.id || audio.temp_url)}
                              onPlay={() => handlePlayAudio(
                                audio.id || audio.temp_url, 
                                audio.playback_url || audio.display_url || audio.temp_url
                              )}
                              onPause={handlePauseAudio}
                              currentTime={playingAudio === (audio.id || audio.temp_url) ? currentTime : 0}
                              duration={playingAudio === (audio.id || audio.temp_url) ? duration : audio.duration_seconds || 0}
                              volume={volume}
                              onVolumeChange={handleVolumeChange}
                              playbackRate={playbackRate}
                              onPlaybackRateChange={handlePlaybackRateChange}
                              onSeek={handleSeek}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Gallery Section */}
                    {imageMedia.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="w-4 h-4 text-green-600" />
                          <h4 className="text-sm font-semibold text-gray-900">Image Gallery</h4>
                          <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                            {imageMedia.length}
                          </span>
                        </div>
                        <ImageGallery
                          images={imageMedia}
                          onImageClick={handleImageClick}
                        />
                      </div>
                    )}

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

      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        style={{ display: 'none' }}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage.url}
        imageName={selectedImage.name}
        onClose={handleCloseImageModal}
      />
    </div>
  );
};

export default MediaUploadStep;