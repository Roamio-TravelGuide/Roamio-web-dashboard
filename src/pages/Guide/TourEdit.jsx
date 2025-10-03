// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/authContext';
// import { getTourById , updateTour } from '../../api/tour/tourApi';
// import { toast } from 'react-hot-toast';
// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { BasicInfoStepEdit } from '../../components/tour/BasicInfoStepEdit';
// import { RouteMapStepEdit } from '../../components/tour/RouteMapStepEdit';
// import { MediaUploadStepEdit } from '../../components/tour/MediaUploadStepEdit';
// import { ReviewStepEdit } from '../../components/tour/ReviewStepEdit';

// const tabs = [
//   { id: 1, name: 'Basic Info' },
//   { id: 2, name: 'Route' },
//   { id: 3, name: 'Media' },
//   { id: 4, name: 'Review' }
// ];

// // Helper function to calculate distance between two points (Haversine formula)
// const getDistanceBetweenPoints = (point1, point2) => {
//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(point2.lat - point1.lat);
//   const dLng = deg2rad(point2.lng - point1.lng);
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
//     Math.sin(dLng/2) * Math.sin(dLng/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c * 1000; // Distance in meters
// };

// const deg2rad = (deg) => {
//   return deg * (Math.PI/180);
// };

// // Helper function to estimate walking time in seconds
// const getWalkingTime = (distanceMeters) => {
//   const walkingSpeed = 1.4; // m/s (average walking speed)
//   return distanceMeters / walkingSpeed;
// };

// const TourEditPage = ({ tour: initialTour }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [tourData, setTourData] = useState(initialTour || location.state?.tour || null);
//   const [isLoading, setIsLoading] = useState(!initialTour && !location.state?.tour);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     if (tourData) return; // If we already have tour data (from props or location state), don't fetch

//     const fetchTourData = async () => {
//       try {
//         const tour = await getTourById(id);
//         if (tour.guide_id !== user?.id) {
//           toast.error('You are not authorized to edit this tour');
//           navigate(`/guide/tour/view/${tour.guide_id}`);
//           return;
//         }
//         setTourData(tour);
//       } catch (error) {
//         toast.error('Failed to load tour data');
//         navigate('/guide/tours');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTourData();
//   }, [id, user?.id, navigate, tourData]);

//   const validateMediaContent = useCallback(() => {
//     if (!tourData?.tour_stops) return [];

//     const warnings = [];

//     tourData.tour_stops.forEach((stop, index) => {
//       if (index === tourData.tour_stops.length - 1) return;

//       const nextStop = tourData.tour_stops[index + 1];
//       if (!stop.location || !nextStop.location) {
//         warnings.push({
//           stopIndex: index,
//           message: 'Location not set for this stop',
//           severity: 'error'
//         });
//         return;
//       }

//       const distance = getDistanceBetweenPoints(
//         { lat: stop.location.latitude, lng: stop.location.longitude },
//         { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
//       );

//       const walkingTime = getWalkingTime(distance);
//       const maxRecommendedAudioTime = Math.floor(walkingTime * 0.8);

//       const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
//       const totalAudioDuration = audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0);

//       if (totalAudioDuration < maxRecommendedAudioTime) {
//         warnings.push({
//           stopIndex: index,
//           message: `Audio duration (${totalAudioDuration}s) is too short for this stop`,
//           severity: 'warning'
//         });
//       }

//       if (audioFiles.length === 0) {
//         warnings.push({
//           stopIndex: index,
//           message: 'No audio content added',
//           severity: 'error'
//         });
//       }
//     });

//     return warnings;
//   }, [tourData?.tour_stops]);

//   const validationWarnings = useMemo(() => {
//     return currentStep >= 3 ? validateMediaContent() : [];
//   }, [currentStep, validateMediaContent]);

//   const validateCurrentStep = useCallback(() => {
//     if (!tourData) return false;
    
//     switch (currentStep) {
//       case 1:
//         return tourData.title?.trim() && tourData.description?.trim();
//       case 2: 
//         return tourData.tour_stops?.length >= 2 &&
//                tourData.tour_stops.every(stop => stop.location);
//       case 3: 
//         return tourData.tour_stops.every(stop => 
//           stop.media?.some(m => m.media_type === 'audio')
//         ) && validationWarnings.every(w => w.severity !== 'error');
//       case 4: 
//         return true;
//       default: 
//         return false;
//     }
//   }, [currentStep, tourData, validationWarnings]);

//   const canGoNext = useMemo(() => currentStep < tabs.length && validateCurrentStep(), [currentStep, validateCurrentStep]);
//   const canGoBack = currentStep > 1;

//   const handleNext = () => canGoNext && setCurrentStep(c => c + 1);
//   const handlePrevious = () => canGoBack && setCurrentStep(c => c - 1);

//   const handleTourDataUpdate = (updates) => {
//     setTourData(prev => ({ ...prev, ...updates }));
//   };

//   const handleStopsUpdate = (stops) => {
//     setTourData(prev => ({ ...prev, tour_stops: stops }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       console.log(tourData);
//       await updateTour(id, tourData);
//       toast.success('Tour updated successfully');
//       navigate(`/guide/tourpackages`);
//     } catch (error) {
//       toast.error('Failed to update tour');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderCurrentStep = () => {
//     if (!tourData) return null;

//     const commonProps = {
//       tourData,
//       onUpdate: handleTourDataUpdate,
//       stops: tourData.tour_stops,
//       onStopsUpdate: handleStopsUpdate,
//       validationWarnings,
//       isEditable: true
//     };

//     switch (currentStep) {
//       case 1: return <BasicInfoStepEdit {...commonProps} />;
//       case 2: return <RouteMapStepEdit {...commonProps} />;
//       case 3: return <MediaUploadStepEdit {...commonProps} />;
//       case 4: return <ReviewStepEdit {...commonProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
//       default: return null;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg">Loading tour data...</div>
//       </div>
//     );
//   }

//   if (!tourData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg text-red-500">Tour not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-fixed bg-center bg-cover">
//       <div className="px-4 py-8 mx-auto">
//         <div className="mx-8 overflow-hidden bg-white rounded-lg shadow">
//           <div className="p-6 sm:p-8">
//             <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Tour: {tourData.title}</h1>
//             {renderCurrentStep()}
//           </div>
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <button
//                 onClick={handlePrevious}
//                 disabled={!canGoBack}
//                 className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//                   !canGoBack
//                     ? 'text-gray-400 cursor-not-allowed'
//                     : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
//                 }`}
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Previous
//               </button>

//               {currentStep < tabs.length ? (
//                 <button
//                   onClick={handleNext}
//                   disabled={!canGoNext}
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
//                     canGoNext
//                       ? 'bg-indigo-600 hover:bg-indigo-700'
//                       : 'bg-gray-300 cursor-not-allowed'
//                   }`}
//                 >
//                   Next
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
//                     !isSubmitting
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-green-400 cursor-not-allowed'
//                   }`}
//                 >
//                   {isSubmitting ? 'Updating...' : 'Update Tour'}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TourEditPage;