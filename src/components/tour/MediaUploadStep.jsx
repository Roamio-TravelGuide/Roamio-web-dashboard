// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { MediaUpload } from '../ui/MediaUpload';
// import { AlertTriangle, CheckCircle, Clock, Volume2, Image as ImageIcon, Loader2 } from 'lucide-react';
// import { useMapbox } from '../../hooks/useMaps';
// import { toast } from 'react-hot-toast';

// // Constants
// const MEDIA_TYPES = {
//   AUDIO: 'audio',
//   IMAGE: 'image'
// };

// // ADDED: Utility function to convert file to base64
// const convertFileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// };

// export const MediaUploadStep = ({
//   stops = [],
//   onStopsUpdate,
//   onValidationChange
// }) => {
//   // State
//   const [selectedStopIndex, setSelectedStopIndex] = useState(0);
//   const [validationWarnings, setValidationWarnings] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false); // CHANGED: isUploading → isProcessing
  
//   // Hooks
//   const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

//   // Effects
//   useEffect(() => {
//     validateAudioDurations();
//   }, [stops]);

//   useEffect(() => {
//     if (onValidationChange) {
//       const hasErrors = validationWarnings.some(w => w.severity === 'error');
//       onValidationChange(!hasErrors);
//     }
//   }, [validationWarnings, onValidationChange]);

//   // Helper functions
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}m ${remainingSeconds}s`;
//   };

//   const getAudioDuration = useCallback((file) => {
//     return new Promise((resolve) => {
//       const audio = new Audio();
//       audio.src = URL.createObjectURL(file);
      
//       audio.addEventListener('loadedmetadata', () => {
//         const duration = Math.floor(audio.duration);
//         URL.revokeObjectURL(audio.src);
//         resolve(duration);
//       });
      
//       audio.addEventListener('error', () => {
//         resolve(0);
//       });
//     });
//   }, []);

//   // Validation
//   const validateAudioDurations = useCallback(() => {
//     const warnings = [];

//     stops.forEach((stop, index) => {
//       if (index === stops.length - 1) return;

//       const nextStop = stops[index + 1];
//       if (!stop.location || !nextStop.location) return;

//       const distance = getDistanceBetweenPoints(
//         { lat: stop.location.latitude, lng: stop.location.longitude },
//         { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
//       );

//       const walkingTime = getWalkingTime(distance);
//       const minRecommendedAudioTime = Math.floor(walkingTime * 0.8);

//       const audioFiles = stop.media?.filter(m => {
//         const mediaType = m.media?.media_type || m.media_type;
//         return mediaType === MEDIA_TYPES.AUDIO;
//       }) || [];
      
//       const totalAudioDuration = audioFiles.reduce((total, audio) => {
//         const duration = audio.media?.duration_seconds || audio.duration_seconds || 0;
//         return total + duration;
//       }, 0);

//       // Required: At least one audio file per stop
//       if (audioFiles.length === 0) {
//         warnings.push({
//           stopIndex: index,
//           message: 'At least one audio file is required for this stop',
//           severity: 'error'
//         });
//       }

//       // Recommended: Audio duration should be sufficient
//       if (totalAudioDuration < minRecommendedAudioTime) {
//         warnings.push({
//           stopIndex: index,
//           message: `Recommended minimum audio duration is ${formatTime(minRecommendedAudioTime)} (${formatTime(totalAudioDuration)} currently)`,
//           severity: 'warning'
//         });
//       }
//     });

//     setValidationWarnings(warnings);
//   }, [stops, getDistanceBetweenPoints, getWalkingTime]);

//   // CHANGED: Completely rewritten to handle local processing instead of S3 upload
//   const handleMediaAdd = useCallback(async (stopIndex, newMedia) => {
//     const processToast = toast.loading('Processing media files...'); // CHANGED: 'Uploading' → 'Processing'
//     setIsProcessing(true);
    
//     try {
//       const updatedStops = [...stops];
//       const processedMedia = await Promise.all(
//         newMedia.map(async (file) => {
//           const base64Data = await convertFileToBase64(file.file);
//           const duration = file.format.startsWith('audio/') 
//             ? await getAudioDuration(file.file) 
//             : 0;

//           return {
//             media_type: file.format.startsWith('audio/') ? MEDIA_TYPES.AUDIO : MEDIA_TYPES.IMAGE,
//             duration_seconds: duration,
//             file_name: file.file.name,
//             file_type: file.file.type,
//             file_size: file.file.size,
//             base64_data: base64Data,
//             temp_url: file.format.startsWith('image/') ? URL.createObjectURL(file.file) : null
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
//       toast.success('Media files processed successfully!', { id: processToast }); // CHANGED: 'uploaded' → 'processed'
//     } catch (error) {
//       console.error('Processing failed:', error);
//       toast.error('Failed to process media files. Please try again.', { id: processToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [stops, onStopsUpdate, getAudioDuration]);

//   // CHANGED: Simplified removal - no S3 API call needed
//   const handleMediaRemove = useCallback(async (stopIndex, mediaIndex) => {
//     const deleteToast = toast.loading('Removing media file...');
    
//     try {
//       setIsProcessing(true);
//       const updatedStops = [...stops];
//       const mediaToRemove = updatedStops[stopIndex].media?.[mediaIndex];
      
//       // Revoke object URL if it exists
//       if (mediaToRemove?.temp_url) {
//         URL.revokeObjectURL(mediaToRemove.temp_url);
//       }
      
//       updatedStops[stopIndex].media.splice(mediaIndex, 1);
//       onStopsUpdate(updatedStops);
      
//       toast.success('Media file removed successfully', { id: deleteToast });
//     } catch (error) {
//       console.error('Error removing media:', error);
//       toast.error('Failed to remove media. Please try again.', { id: deleteToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [stops, onStopsUpdate]);

//   const currentStop = stops[selectedStopIndex] || {};
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

//   const totalAudioDuration = useMemo(() => 
//     (currentStop.media || [])
//       .filter(m => {
//         const mediaType = m.media?.media_type || m.media_type;
//         return mediaType === MEDIA_TYPES.AUDIO;
//       })
//       .reduce((total, audio) => {
//         const duration = audio.media?.duration_seconds || audio.duration_seconds || 0;
//         return total + duration;
//       }, 0),
//     [currentStop]
//   );

//   const renderStopNavigation = () => (
//     <div className="lg:w-1/4">
//       <div className="overflow-hidden border border-gray-200 rounded-xl">
//         <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
//           <h3 className="font-medium text-gray-800">Tour Stops</h3>
//           <p className="mt-1 text-sm text-gray-600">
//             Select a stop to add media
//           </p>
//         </div>
        
//         <div className="p-5 space-y-2">
//           {stops.map((stop, index) => {
//             const validation = validationWarnings.filter(w => w.stopIndex === index);
//             const hasErrors = validation.some(w => w.severity === 'error');
//             const hasWarnings = validation.some(w => w.severity === 'warning');
            
//             return (
//               <button
//                 key={stop.tempId || stop.id}
//                 onClick={() => !isProcessing && setSelectedStopIndex(index)} // CHANGED: isUploading → isProcessing
//                 className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative ${
//                   selectedStopIndex === index
//                     ? 'bg-blue-100 border border-blue-300'
//                     : hasErrors
//                     ? 'bg-red-50 border border-red-200 hover:border-red-300'
//                     : hasWarnings
//                     ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
//                     : 'border border-gray-200 hover:border-gray-300'
//                 } ${isProcessing ? 'cursor-not-allowed' : ''}`} // CHANGED: isUploading → isProcessing
//                 disabled={isProcessing} // CHANGED: isUploading → isProcessing
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center mb-1 space-x-2">
//                       <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
//                         {index + 1}
//                       </span>
//                       <span className="font-medium text-gray-900 truncate">
//                         {stop.stop_name}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center space-x-3 text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Volume2 size={10} />
//                         <span>
//                           {stop.media?.filter(m => {
//                             const mediaType = m.media?.media_type || m.media_type;
//                             return mediaType === MEDIA_TYPES.AUDIO;
//                           }).length || 0}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <ImageIcon size={10} />
//                         <span>
//                           {stop.media?.filter(m => {
//                             const mediaType = m.media?.media_type || m.media_type;
//                             return mediaType === MEDIA_TYPES.IMAGE;
//                           }).length || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex-shrink-0 ml-2">
//                     {hasErrors ? (
//                       <AlertTriangle className="text-red-500" size={16} />
//                     ) : hasWarnings ? (
//                       <AlertTriangle className="text-amber-500" size={16} />
//                     ) : stop.media?.length > 0 ? (
//                       <CheckCircle className="text-green-500" size={16} />
//                     ) : null}
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );

//   const renderMediaUploadArea = () => (
//     <div className="space-y-6">
//       <div className="overflow-hidden border border-gray-200 rounded-xl">
//         <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
//           <div className="flex items-center justify-between">
//             <h3 className="font-medium text-gray-800">
//               {currentStop.stop_name || `Stop ${selectedStopIndex + 1}`}
//             </h3>
//             <div className="text-sm text-gray-600">
//               Stop {selectedStopIndex + 1} of {stops.length}
//             </div>
//           </div>
//         </div>
        
//         <div className="p-5 space-y-6">
//           {currentStop.description && (
//             <p className="text-gray-700">{currentStop.description}</p>
//           )}

//           {selectedStopIndex < stops.length - 1 && (
//             <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
//               <div className="flex items-start space-x-2">
//                 <Clock className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
//                 <div>
//                   <h4 className="font-medium text-blue-900">Audio Duration Guidelines</h4>
//                   <div className="mt-1 space-y-1 text-sm text-blue-800">
//                     <div>Walking time to next stop: {formatTime(walkingTimeToNextStop)}</div>
//                     <div>Recommended min audio: {formatTime(recommendedAudioTime)}</div>
//                     <div>Current audio duration: {formatTime(totalAudioDuration)}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <MediaUpload
//             media={currentStop.media || []}
//             onMediaAdd={(newMedia) => handleMediaAdd(selectedStopIndex, newMedia)}
//             onMediaRemove={(mediaIndex) => handleMediaRemove(selectedStopIndex, mediaIndex)}
//             acceptedTypes={['audio/*', 'image/*']}
//             maxFiles={10}
//             isUploading={isProcessing} // CHANGED: isUploading → isProcessing
//             uploadProgress={0} // CHANGED: Removed progress since no upload
//           />

//           <div className="space-y-2">
//             {stopValidation.errors.map((error, index) => (
//               <div key={index} className="flex items-start p-3 space-x-2 border border-red-200 rounded-lg bg-red-50">
//                 <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
//                 <span className="text-sm text-red-700">{error.message}</span>
//               </div>
//             ))}
//             {stopValidation.warnings.map((warning, index) => (
//               <div key={index} className="flex items-start p-3 space-x-2 border rounded-lg bg-amber-50 border-amber-200">
//                 <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
//                 <span className="text-sm text-amber-700">{warning.message}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderValidationSummary = () => (
//     <div className="overflow-hidden border border-gray-200 rounded-xl">
//       <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
//         <h3 className="font-medium text-gray-800">Content Requirements</h3>
//       </div>
      
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
//                       <strong>{stop.stop_name}:</strong> {warning.message}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <div className="p-4 text-sm border border-gray-200 rounded-lg bg-gray-50">
//               <h4 className="mb-2 font-medium text-gray-800">Content Guidelines</h4>
//               <ul className="space-y-1 text-gray-600">
//                 <li>• <strong>Required:</strong> Each stop must have at least one audio file</li>
//                 <li>• <strong>Recommended:</strong> Audio duration should be more than 80% of walking time between stops</li>
//               </ul>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center p-4 space-x-2 border border-green-200 rounded-lg bg-green-50">
//             <CheckCircle className="text-green-500" size={16} />
//             <span className="text-sm text-green-700">All stops meet the content requirements</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className={`mx-auto ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}> {/* CHANGED: isUploading → isProcessing */}
//       <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
//         <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
//         <p className="mt-2 text-gray-600">
//           Add audio guides and images for each stop of your tour
//         </p>
//       </div>

//       <div className="flex flex-col gap-6 lg:flex-row">
//         {renderStopNavigation()}
//         <div className="lg:w-3/4">
//           {stops.length === 0 ? (
//             <div className="p-6 text-center border border-gray-200 rounded-xl bg-gray-50">
//               <p className="text-gray-600">No stops available. Please add stops in the previous step.</p>
//             </div>
//           ) : (
//             <>
//               {renderMediaUploadArea()}
//               {renderValidationSummary()}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MediaUpload } from '../ui/MediaUpload';
import { AlertTriangle, CheckCircle, Clock, Volume2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useMapbox } from '../../hooks/useMaps';
import { toast } from 'react-hot-toast';

// Constants
const MEDIA_TYPES = {
  AUDIO: 'audio',
  IMAGE: 'image'
};

export const MediaUploadStep = ({
  stops = [],
  onStopsUpdate,
  onValidationChange
}) => {
  // State
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hooks
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

  // Effects
  useEffect(() => {
    validateAudioDurations();
  }, [stops]);

  useEffect(() => {
    if (onValidationChange) {
      const hasErrors = validationWarnings.some(w => w.severity === 'error');
      onValidationChange(!hasErrors);
    }
  }, [validationWarnings, onValidationChange]);

  // Helper functions
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

  // Validation
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
        const mediaType = m.media_type || (m.file?.type.startsWith('audio/') ? 'audio' : 'image');
        return mediaType === MEDIA_TYPES.AUDIO;
      }) || [];
      
      const totalAudioDuration = audioFiles.reduce((total, audio) => {
        const duration = audio.duration_seconds || 0;
        return total + duration;
      }, 0);

      // Required: At least one audio file per stop
      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: 'At least one audio file is required for this stop',
          severity: 'error'
        });
      }

      // Recommended: Audio duration should be sufficient
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
    const processToast = toast.loading('Processing media files...');
    setIsProcessing(true);
    
    try {
      const updatedStops = [...stops];
      const processedMedia = await Promise.all(
        newMedia.map(async (fileObj) => {
          const duration = fileObj.file.type.startsWith('audio/') 
            ? await getAudioDuration(fileObj.file) 
            : 0;

          // Create temporary URL for images for preview
          const tempUrl = fileObj.file.type.startsWith('image/') ? URL.createObjectURL(fileObj.file) : null;

          return {
            file: fileObj.file,
            media_type: fileObj.file.type.startsWith('audio/') ? MEDIA_TYPES.AUDIO : MEDIA_TYPES.IMAGE,
            duration_seconds: duration,
            file_name: fileObj.file.name,
            file_type: fileObj.file.type,
            file_size: fileObj.file.size,
            temp_url: tempUrl
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
  }, [stops, onStopsUpdate, getAudioDuration]);

  const handleMediaRemove = useCallback(async (stopIndex, mediaIndex) => {
    const deleteToast = toast.loading('Removing media file...');
    
    try {
      setIsProcessing(true);
      const updatedStops = [...stops];
      const mediaToRemove = updatedStops[stopIndex].media?.[mediaIndex];
      
      // Revoke object URL if it exists
      if (mediaToRemove?.temp_url) {
        URL.revokeObjectURL(mediaToRemove.temp_url);
      }
      
      updatedStops[stopIndex].media.splice(mediaIndex, 1);
      onStopsUpdate(updatedStops);
      
      toast.success('Media file removed successfully', { id: deleteToast });
    } catch (error) {
      console.error('Error removing media:', error);
      toast.error('Failed to remove media. Please try again.', { id: deleteToast });
    } finally {
      setIsProcessing(false);
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
        const mediaType = m.media_type || (m.file?.type.startsWith('audio/') ? 'audio' : 'image');
        return mediaType === MEDIA_TYPES.AUDIO;
      })
      .reduce((total, audio) => {
        const duration = audio.duration_seconds || 0;
        return total + duration;
      }, 0),
    [currentStop]
  );

  // ... (rest of the component remains the same, just use the corrected logic above)

  const renderStopNavigation = () => (
    <div className="lg:w-1/4">
      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
          <h3 className="font-medium text-gray-800">Tour Stops</h3>
          <p className="mt-1 text-sm text-gray-600">
            Select a stop to add media
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
                onClick={() => !isProcessing && setSelectedStopIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative ${
                  selectedStopIndex === index
                    ? 'bg-blue-100 border border-blue-300'
                    : hasErrors
                    ? 'bg-red-50 border border-red-200 hover:border-red-300'
                    : hasWarnings
                    ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isProcessing ? 'cursor-not-allowed' : ''}`}
                disabled={isProcessing}
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
                            const mediaType = m.media_type || (m.file?.type.startsWith('audio/') ? 'audio' : 'image');
                            return mediaType === MEDIA_TYPES.AUDIO;
                          }).length || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ImageIcon size={10} />
                        <span>
                          {stop.media?.filter(m => {
                            const mediaType = m.media_type || (m.file?.type.startsWith('image/') ? 'image' : 'audio');
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

  // ... (rest of the component remains the same)

  return (
    <div className={`mx-auto ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}>
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Media Content</h2>
        <p className="mt-2 text-gray-600">
          Add audio guides and images for each stop of your tour
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
              {/* MediaUploadArea and ValidationSummary components */}
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
                      isUploading={isProcessing}
                      uploadProgress={0}
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

              {/* Validation Summary */}
              <div className="mt-6 overflow-hidden border border-gray-200 rounded-xl">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};