// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { 
//   ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X, 
//   Check, AlertCircle, Headphones, Image as ImageIcon, Video, User,
//   CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight
// } from 'lucide-react';
// import { getTourById } from '../../api/tour/tourApi';

// const StatusBadge = ({ status }) => {
//   const config = {
//     pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
//     published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
//     rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
//     pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
//     approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' }
//   }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

//   return (
//     <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//       {config.label}
//     </span>
//   );
// };

// const MediaCard = ({ media, onPlay, onPreview, isPlaying = false }) => {
//   const getMediaIcon = () => {
//     switch (media.media_type) {
//       case 'audio': return <Volume2 className="w-5 h-5 text-blue-500" />;
//       case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
//       case 'video': return <Video className="w-5 h-5 text-blue-500" />;
//       default: return <Volume2 className="w-5 h-5 text-blue-500" />;
//     }
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds) return '0:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-xs">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-start space-x-3">
//           <div className="p-2 rounded-lg bg-blue-50">
//             {getMediaIcon()}
//           </div>
//           <div>
//             <h4 className="font-medium text-gray-900">
//               {media.media_type === 'audio' ? 'Audio' : media.media_type === 'image' ? 'Image' : 'Video'} #{media.id}
//             </h4>
//             {media.duration_seconds && (
//               <p className="text-sm text-gray-500">Duration: {formatDuration(media.duration_seconds)}</p>
//             )}
//             {media.format && <p className="text-sm text-gray-500">Format: {media.format}</p>}
//           </div>
//         </div>
//         <StatusBadge status={media.status || 'pending'} />
//       </div>

//       {media.media_type === 'audio' && onPlay && (
//         <button 
//           onClick={onPlay}
//           className="flex items-center justify-center w-full px-4 py-2 mb-3 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//           <span>{isPlaying ? 'Pause' : 'Play'}</span>
//         </button>
//       )}

//       {media.media_type === 'image' && onPreview && (
//         <div className="mb-3">
//           <img 
//             src={media.url} 
//             alt={`Image ${media.id}`}
//             className="object-cover w-full h-40 rounded-lg cursor-pointer hover:opacity-90"
//             onClick={onPreview}
//           />
//           <button 
//             onClick={onPreview}
//             className="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
//           >
//             <Eye className="w-4 h-4" />
//             <span>View Full Size</span>
//           </button>
//         </div>
//       )}

//       {media.media_type === 'video' && (
//         <div className="w-full h-40 mb-3 overflow-hidden bg-black rounded-lg">
//           <video 
//             src={media.url} 
//             className="object-cover w-full h-full"
//             controls
//             preload="metadata"
//           />
//         </div>
//       )}

//       {media.status === 'rejected' && media.rejection_reason && (
//         <div className="p-3 mb-3 border border-red-200 rounded-lg bg-red-50">
//           <p className="mb-1 text-sm font-medium text-red-800">Rejection Reason:</p>
//           <p className="text-sm text-red-700">{media.rejection_reason}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// const TourStopCard = ({ stop, isActive, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full text-left p-3 rounded-lg border transition-all ${
//         isActive
//           ? 'bg-blue-50 border-blue-200 text-blue-900'
//           : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
//             {stop.sequence_no}
//           </span>
//           <span className="font-medium truncate">{stop.name}</span>
//         </div>
//         <span className="text-xs text-gray-500">{stop.allMedia.length} media</span>
//       </div>
//     </button>
//   );
// };

// const TourRejectModal = ({ isOpen, onClose, reason, onReasonChange, onConfirm, isSubmitting }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Reject Tour Package</h3>
//             <button 
//               onClick={onClose} 
//               className="text-gray-400 hover:text-gray-600"
//               disabled={isSubmitting}
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="mb-4 text-gray-600">
//             You're about to reject this entire tour package. Please provide a reason.
//           </p>
//           <textarea
//             value={reason}
//             onChange={(e) => onReasonChange(e.target.value)}
//             placeholder="Please provide a detailed reason for rejection..."
//             className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={4}
//             required
//             autoFocus
//             disabled={isSubmitting}
//           />
//           <div className="flex justify-end mt-6 space-x-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={!reason.trim() || isSubmitting}
//               className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 ${
//                 reason.trim() && !isSubmitting
//                   ? 'bg-red-600 hover:bg-red-700' 
//                   : 'bg-red-300 cursor-not-allowed'
//               }`}
//             >
//               {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
//               <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ImagePreviewModal = ({ imageUrl, onClose }) => {
//   if (!imageUrl) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
//       <div className="relative max-w-4xl max-h-full">
//         <button
//           onClick={onClose}
//           className="absolute right-0 text-white -top-10 hover:text-gray-300"
//         >
//           <XCircle className="w-8 h-8" />
//         </button>
//         <img 
//           src={imageUrl} 
//           alt="Full size view"
//           className="object-contain max-w-full max-h-full rounded-lg"
//         />
//       </div>
//     </div>
//   );
// };

// const TourDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [tour, setTour] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [playingAudio, setPlayingAudio] = useState(null);
//   const [selectedStopId, setSelectedStopId] = useState(null);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [expandedSections, setExpandedSections] = useState({
//     audio: true,
//     images: true,
//     videos: true
//   });
//   const [showTourRejectModal, setShowTourRejectModal] = useState(false);
//   const [tourRejectReason, setTourRejectReason] = useState('');
//   const [isApproving, setIsApproving] = useState(false);
//   const [isRejecting, setIsRejecting] = useState(false);
  
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const fetchTour = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         console.log(`Fetching tour with ID: ${id}`);
//         const response = await getTourById(`${id}`);
        
//         console.log('API Response:', response.data);
        
//         if (!response.data?.success || !response.data?.data) {
//           throw new Error('Invalid tour data received');
//         }

//         const data = response.data.data;
//         setTour(data);
        
//         if (!selectedStopId && data.tour_stops?.[0]) {
//           setSelectedStopId(data.tour_stops[0].id);
//         }
//       } catch (error) {
//         console.error('Error fetching tour:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchTour();
//   }, [id]);

//   const handlePlayAudio = (mediaId, audioUrl) => {
//     if (playingAudio === mediaId) {
//       setPlayingAudio(null);
//       if (audioRef.current) audioRef.current.pause();
//     } else {
//       setPlayingAudio(mediaId);
//       if (audioRef.current) {
//         audioRef.current.src = audioUrl;
//         audioRef.current.play().catch((error) => {
//           console.error('Audio play failed:', error);
//           toast.error('Failed to play audio');
//           setPlayingAudio(null);
//         });
//       }
//     }
//   };

//   const handleApproveTour = async () => {
//     if (!tour || !id || isApproving) return;
    
//     setIsApproving(true);
//     const toastId = toast.loading('Approving tour...');
    
//     try {
//       console.log(`Attempting to approve tour ${id}...`);

//       const response = await axios.patch(
//         `${API_BASE_URL}/tour-packages/${id}/status`,
//         { status: 'published' },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000
//         }
//       );

//       console.log('Approval response received:', response.data);

//       if (response.status === 200 && response.data?.success) {
//         setTour(prevTour => {
//           if (!prevTour) return null;
          
//           return {
//             ...prevTour,
//             status: 'published',
//             rejection_reason: undefined,
//             tour_stops: prevTour.tour_stops
//           };
//         });
        
//         setError(null);
        
//         toast.success('🎉 Tour approved successfully! The tour is now published and available to users.', { 
//           id: toastId,
//           duration: 5000
//         });
//       } else {
//         throw new Error(response.data?.message || 'Unexpected response format');
//       }
//     } catch (error) {
//       console.error('Approval failed:', error);
      
//       let errorMessage = 'Failed to approve tour. Please try again.';
      
//       if (axios.isAxiosError(error)) {
//         if (error.code === 'ECONNABORTED') {
//           errorMessage = 'Request timeout. Please check your connection.';
//         } else if (error.response?.status === 404) {
//           errorMessage = 'Tour not found. It may have been deleted.';
//         } else if (error.response?.status >= 500) {
//           errorMessage = 'Server error. Please try again later.';
//         } else if (error.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         }
//       }

//       setError(errorMessage);
//       toast.error(errorMessage, { id: toastId });
//     } finally {
//       setIsApproving(false);
//     }
//   };

//   const handleRejectTour = () => {
//     setShowTourRejectModal(true);
//     setTourRejectReason('');
//   };

//   const confirmRejectTour = async () => {
//     if (!tour || !id || !tourRejectReason.trim() || isRejecting) return;

//     setIsRejecting(true);
//     const toastId = toast.loading('Rejecting tour...');

//     try {
//       console.log(`Attempting to reject tour ${id}...`);
//       console.log('Rejection reason:', tourRejectReason);

//       const response = await axios.patch(
//         `${API_BASE_URL}/tour-packages/${id}/status`,
//         {
//           status: 'rejected',
//           rejection_reason: tourRejectReason
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000
//         }
//       );

//       console.log('Rejection response:', response.data);

//       if (response.status === 200 && response.data?.success) {
//         setTour(prevTour => {
//           if (!prevTour) return null;
          
//           return {
//             ...prevTour,
//             status: 'rejected',
//             rejection_reason: tourRejectReason,
//             tour_stops: prevTour.tour_stops
//           };
//         });
        
//         setShowTourRejectModal(false);
//         setTourRejectReason('');
//         setError(null);
        
//         toast.success('✅ Tour rejected successfully. The guide has been notified with your feedback.', { 
//           id: toastId,
//           duration: 5000
//         });
//       } else {
//         throw new Error(response.data?.message || 'Unexpected response format');
//       }
//     } catch (error) {
//       console.error('Rejection failed:', error);
      
//       let errorMessage = 'Failed to reject tour. Please try again.';
      
//       if (axios.isAxiosError(error)) {
//         if (error.code === 'ECONNABORTED') {
//           errorMessage = 'Request timeout. Please check your connection.';
//         } else if (error.response?.status === 404) {
//           errorMessage = 'Tour not found. It may have been deleted.';
//         } else if (error.response?.status === 400) {
//           errorMessage = 'Invalid request data. Please check the rejection reason.';
//         } else if (error.response?.status >= 500) {
//           errorMessage = 'Server error. Please try again later.';
//         } else if (error.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         }
//       }

//       setError(errorMessage);
//       toast.error(errorMessage, { id: toastId });
//     } finally {
//       setIsRejecting(false);
//     }
//   };

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const getMediaByType = (stopId, type) => {
//     const stop = tour?.tour_stops?.find(s => s.id === stopId);
//     return stop?.media.filter(m => m.media_type === type) || [];
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="flex flex-col items-center">
//           <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
//           <div className="text-lg text-gray-600">Loading tour details...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !tour) {
//     return (
//       <div className="p-6 bg-gray-50">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" /> Back
//         </button>
//         <div className="p-4 text-red-600 bg-red-100 rounded-lg">
//           <div className="flex items-center space-x-2">
//             <AlertCircle className="w-5 h-5" />
//             <span>{error || 'Tour not found'}</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const selectedStop = tour.tour_stops?.find(stop => stop.id === selectedStopId);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <button 
//               onClick={() => navigate(-1)}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               <span>Back</span>
//             </button>
//             <div className="flex items-center space-x-3">
//               <span className="text-sm text-gray-500">Status:</span>
//               <StatusBadge status={tour.status} />
//             </div>
//           </div>
//         </div>
//       </header>

//       <section className="bg-white border-b border-gray-200">
//         <div className="px-6 py-6">
//           <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold text-gray-900">{tour.title}</h1>
//               <p className="mt-2 text-gray-600">{tour.description}</p>
              
//               <div className="flex flex-wrap items-center gap-4 mt-4">
//                 <div className="flex items-center space-x-2">
//                   <User className="w-5 h-5 text-gray-400" />
//                   <span className="text-sm font-medium text-gray-700">{tour.guide?.user?.name || 'Unknown Guide'}</span>
//                   {tour.guide?.years_of_experience && (
//                     <span className="text-sm text-gray-500">({tour.guide.years_of_experience} yrs exp)</span>
//                   )}
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <Clock className="w-5 h-5 text-gray-400" />
//                   <span className="text-sm text-gray-700">
//                     {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
//                   </span>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-semibold text-gray-900">${tour.price.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
            
//             {tour.guide?.user?.avatar_url && (
//               <img 
//                 src={tour.guide.user.avatar_url} 
//                 alt={tour.guide.user.name}
//                 className="w-16 h-16 border-2 border-gray-200 rounded-full"
//               />
//             )}
//           </div>

//           {tour.status === 'rejected' && tour.rejection_reason && (
//             <div className="p-4 mt-6 border border-red-200 rounded-lg bg-red-50">
//               <h3 className="mb-2 text-sm font-medium text-red-800">Rejection Reason:</h3>
//               <p className="text-sm text-red-700">{tour.rejection_reason}</p>
//             </div>
//           )}

//           {tour.status === 'pending_approval' && (
//             <div className="flex mt-6 space-x-3">
//               <button
//                 onClick={handleApproveTour}
//                 disabled={isApproving || isRejecting}
//                 className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isApproving ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <CheckCircle className="w-5 h-5" />
//                 )}
//                 <span>{isApproving ? 'Approving...' : 'Approve Tour'}</span>
//               </button>
//               <button
//                 onClick={handleRejectTour}
//                 disabled={isApproving || isRejecting}
//                 className="flex items-center px-4 py-2 space-x-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <XCircle className="w-5 h-5" />
//                 <span>Reject Tour</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <div className="flex flex-col lg:flex-row h-[calc(100vh-220px)]">
//         <div className="overflow-y-auto bg-white border-r border-gray-200 lg:w-1/3 xl:w-1/4">
//           <div className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Tour Stops ({tour.tour_stops?.length || 0})</h2>
//           </div>
//           <div className="p-4 space-y-2">
//             {tour.tour_stops?.map((stop) => (
//               <TourStopCard
//                 key={stop.id}
//                 stop={{
//                   id: stop.id,
//                   sequence_no: stop.sequence_no,
//                   name: stop.stop_name,
//                   description: stop.description || '',
//                   audioClips: stop.media.filter(m => m.media_type === 'audio'),
//                   images: stop.media.filter(m => m.media_type === 'image'),
//                   videos: stop.media.filter(m => m.media_type === 'video'),
//                   allMedia: stop.media
//                 }}
//                 isActive={selectedStopId === stop.id}
//                 onClick={() => setSelectedStopId(stop.id)}
//               />
//             ))}
//           </div>
//         </div>

//         {selectedStop && (
//           <div className="flex-1 overflow-y-auto bg-white">
//             <div className="p-6">
//               <div className="mb-6">
//                 <div className="flex items-center mb-3 space-x-3">
//                   <MapPin className="w-5 h-5 text-blue-500" />
//                   <h2 className="text-xl font-semibold text-gray-900">{selectedStop.stop_name}</h2>
//                   <span className="text-sm text-gray-500">Stop #{selectedStop.sequence_no}</span>
//                 </div>
//                 <p className="text-gray-600">{selectedStop.description}</p>
//               </div>

//               <div className="mb-8">
//                 <button 
//                   onClick={() => toggleSection('audio')}
//                   className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
//                 >
//                   <Headphones className="w-5 h-5 mr-2 text-blue-500" />
//                   <span>Audio Narration ({getMediaByType(selectedStop.id, 'audio').length})</span>
//                   {expandedSections.audio ? (
//                     <ChevronDown className="w-5 h-5 ml-2" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 ml-2" />
//                   )}
//                 </button>
                
//                 {expandedSections.audio && (
//                   getMediaByType(selectedStop.id, 'audio').length > 0 ? (
//                     <div className="grid grid-cols-1 gap-4">
//                       {getMediaByType(selectedStop.id, 'audio').map((audio) => (
//                         <MediaCard
//                           key={audio.id}
//                           media={audio}
//                           onPlay={() => handlePlayAudio(audio.id, audio.url)}
//                           isPlaying={playingAudio === audio.id}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
//                       No audio clips available
//                     </div>
//                   )
//                 )}
//               </div>

//               <div className="mb-8">
//                 <button 
//                   onClick={() => toggleSection('images')}
//                   className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
//                 >
//                   <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
//                   <span>Images ({getMediaByType(selectedStop.id, 'image').length})</span>
//                   {expandedSections.images ? (
//                     <ChevronDown className="w-5 h-5 ml-2" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 ml-2" />
//                   )}
//                 </button>
                
//                 {expandedSections.images && (
//                   getMediaByType(selectedStop.id, 'image').length > 0 ? (
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                       {getMediaByType(selectedStop.id, 'image').map((image) => (
//                         <MediaCard
//                           key={image.id}
//                           media={image}
//                           onPreview={() => {
//                             setSelectedImage(image.url);
//                             setShowImageModal(true);
//                           }}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
//                       No images available
//                     </div>
//                   )
//                 )}
//               </div>

//               <div>
//                 <button 
//                   onClick={() => toggleSection('videos')}
//                   className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
//                 >
//                   <Video className="w-5 h-5 mr-2 text-blue-500" />
//                   <span>Videos ({getMediaByType(selectedStop.id, 'video').length})</span>
//                   {expandedSections.videos ? (
//                     <ChevronDown className="w-5 h-5 ml-2" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 ml-2" />
//                   )}
//                 </button>
                
//                 {expandedSections.videos && (
//                   getMediaByType(selectedStop.id, 'video').length > 0 ? (
//                     <div className="grid grid-cols-1 gap-4">
//                       {getMediaByType(selectedStop.id, 'video').map((video) => (
//                         <MediaCard
//                           key={video.id}
//                           media={video}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
//                       No videos available
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="hidden bg-gray-100 border-l border-gray-200 lg:w-1/3 xl:w-2/5 lg:block">
//           <div className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Tour Route Map</h2>
//             {selectedStop && (
//               <p className="mt-1 text-sm text-gray-600">
//                 {selectedStop.stop_name} - Stop #{selectedStop.sequence_no}
//               </p>
//             )}
//           </div>
//           <div className="relative h-full">
//             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//               <div className="p-6 text-center">
//                 <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-400" />
//                 <h3 className="mb-2 text-xl font-medium text-gray-700">Map View</h3>
//                 <p className="max-w-sm mb-4 text-gray-500">
//                   Interactive map showing the selected tour stop and route will be displayed here.
//                 </p>
//                 {selectedStop && (
//                   <div className="text-sm text-gray-400">
//                     <p>Stop: {selectedStop.stop_name}</p>
//                     <p>Sequence: #{selectedStop.sequence_no}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <audio 
//         ref={audioRef} 
//         onEnded={() => setPlayingAudio(null)}
//         onError={() => {
//           console.error('Audio playback error');
//           setPlayingAudio(null);
//           toast.error('Failed to play audio');
//         }}
//       />

//       <TourRejectModal
//         isOpen={showTourRejectModal}
//         onClose={() => {
//           if (!isRejecting) {
//             setShowTourRejectModal(false);
//             setTourRejectReason('');
//           }
//         }}
//         reason={tourRejectReason}
//         onReasonChange={setTourRejectReason}
//         onConfirm={confirmRejectTour}
//         isSubmitting={isRejecting}
//       />

//       <ImagePreviewModal
//         imageUrl={selectedImage}
//         onClose={() => setShowImageModal(false)}
//       />
//     </div>
//   );
// };

// export default TourDetail;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, MapPin, Clock, Volume2, Edit, Trash2,
  Check, AlertCircle, Headphones, Image as ImageIcon, Video, User,
  CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight,
  Plus, MoreVertical, Settings, Download, Share2, Star, Heart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample tour data - replace with your API data
  const [tour, setTour] = useState({
    id: 1,
    title: "Sigiriya Rock Fortress Experience",
    description: "An immersive audio tour of the ancient rock fortress with historical insights and local stories.",
    status: "published",
    price: 29.99,
    duration_minutes: 180,
    cover_image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800&h=600&fit=crop",
    guide: {
      user: {
        name: "Rajith Perera",
        avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.8
      },
      years_of_experience: 7,
      languages: ["English", "Sinhala"]
    },
    tour_stops: [
      {
        id: 1,
        sequence_no: 1,
        stop_name: "Main Entrance & Ticket Booth",
        description: "Begin your journey at the main entrance where you'll learn about ticket pricing and historical significance.",
        location: { lat: 7.9569, lng: 80.7597 },
        media: [
          {
            id: 101,
            media_type: "audio",
            url: "https://example.com/audio1.mp3",
            duration_seconds: 187,
            format: "MP3",
            status: "approved"
          },
          {
            id: 102,
            media_type: "image",
            url: "https://images.unsplash.com/photo-1581857514791-6defb6f8c1b6?w=800&h=600&fit=crop",
            format: "JPEG",
            status: "approved"
          }
        ]
      },
      {
        id: 2,
        sequence_no: 2,
        stop_name: "The Mirror Wall",
        description: "Discover the famous mirror wall with ancient graffiti that dates back over 1000 years.",
        location: { lat: 7.9575, lng: 80.7602 },
        media: [
          {
            id: 201,
            media_type: "audio",
            url: "https://example.com/audio2.mp3",
            duration_seconds: 243,
            format: "MP3",
            status: "approved"
          },
          {
            id: 202,
            media_type: "image",
            url: "https://images.unsplash.com/photo-1518544866330-95b5af6d2367?w=800&h=600&fit=crop",
            format: "JPEG",
            status: "approved"
          },
          {
            id: 203,
            media_type: "video",
            url: "https://example.com/video1.mp4",
            duration_seconds: 45,
            format: "MP4",
            status: "approved"
          }
        ]
      },
      {
        id: 3,
        sequence_no: 3,
        stop_name: "Lion's Paw Terrace",
        description: "Stand in awe before the massive lion paws that remain from the original entrance.",
        location: { lat: 7.9578, lng: 80.7608 },
        media: [
          {
            id: 301,
            media_type: "audio",
            url: "https://example.com/audio3.mp3",
            duration_seconds: 156,
            format: "MP3",
            status: "approved"
          }
        ]
      }
    ],
    stats: {
      total_listens: 1243,
      average_rating: 4.7,
      favorites: 287,
      shares: 156
    }
  });

  const [selectedStopId, setSelectedStopId] = useState(tour.tour_stops[0]?.id || null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    audio: true,
    images: true,
    videos: true
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const audioRef = useRef(null);
  const selectedStop = tour.tour_stops.find(stop => stop.id === selectedStopId);

  const handlePlayAudio = (mediaId, audioUrl) => {
    if (playingAudio === mediaId) {
      setPlayingAudio(null);
      if (audioRef.current) audioRef.current.pause();
    } else {
      setPlayingAudio(mediaId);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch((error) => {
          console.error('Audio play failed:', error);
          toast.error('Failed to play audio');
          setPlayingAudio(null);
        });
      }
    }
  };

  const handleDeleteTour = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Tour deleted successfully');
      navigate('/guide/tours');
    } catch (error) {
      toast.error('Failed to delete tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const getMediaByType = (stopId, type) => {
    const stop = tour.tour_stops.find(s => s.id === stopId);
    return stop?.media.filter(m => m.media_type === type) || [];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cover image */}
      <div className="relative h-64 bg-gray-800 overflow-hidden">
        <img 
          src={tour.cover_image} 
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-8">
          <div className="flex items-start justify-between">
            <div>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-white hover:text-gray-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Tours</span>
              </button>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full">
                  {tour.status === 'published' ? 'Published' : 'Draft'}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-white">{tour.stats.average_rating.toFixed(1)}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tour.title}</h1>
              <p className="text-gray-200 max-w-2xl">{tour.description}</p>
            </div>
            
            <div className="flex space-x-3">
              <Link
                to={`/guide/tours/${id}/edit`}
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDeleteTour}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-70"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5 mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Tour stops */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                  Tour Stops ({tour.tour_stops.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {tour.tour_stops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => setSelectedStopId(stop.id)}
                    className={`w-full text-left p-4 transition-colors ${
                      selectedStopId === stop.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedStopId === stop.id 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {stop.sequence_no}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{stop.stop_name}</h3>
                        <p className="text-sm text-gray-500 truncate">{stop.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Headphones className="w-3 h-3 mr-1" />
                            {stop.media.filter(m => m.media_type === 'audio').length}
                          </span>
                          <span className="flex items-center">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            {stop.media.filter(m => m.media_type === 'image').length}
                          </span>
                          <span className="flex items-center">
                            <Video className="w-3 h-3 mr-1" />
                            {stop.media.filter(m => m.media_type === 'video').length}
                          </span>
                        </div>
                      </div>
                      {selectedStopId === stop.id && (
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <Link
                  to={`/guide/tours/${id}/stops/new`}
                  className="flex items-center justify-center w-full px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Stop
                </Link>
              </div>
            </div>
            
            {/* Tour stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Listens</span>
                  <span className="font-medium">{tour.stats.total_listens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{tour.stats.average_rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-medium">{tour.stats.favorites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-medium">{tour.stats.shares}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content - Selected stop details */}
          <div className="flex-1">
            {selectedStop ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Stop header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        Stop {selectedStop.sequence_no}: {selectedStop.stop_name}
                      </h2>
                      <p className="text-gray-600">{selectedStop.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/edit`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Stop"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Stop"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Media sections */}
                <div className="p-5">
                  {/* Audio section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => toggleSection('audio')}
                        className="flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        <Headphones className="w-5 h-5 mr-2 text-blue-500" />
                        <span>Audio Narration ({getMediaByType(selectedStop.id, 'audio').length})</span>
                        {expandedSections.audio ? (
                          <ChevronDown className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronRight className="w-5 h-5 ml-2" />
                        )}
                      </button>
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=audio`}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Audio
                      </Link>
                    </div>
                    
                    {expandedSections.audio && (
                      getMediaByType(selectedStop.id, 'audio').length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {getMediaByType(selectedStop.id, 'audio').map((audio) => (
                            <div key={audio.id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <Volume2 className="w-5 h-5 text-blue-500" />
                                  <span className="font-medium">Audio #{audio.id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    {Math.floor(audio.duration_seconds / 60)}:
                                    {(audio.duration_seconds % 60).toString().padStart(2, '0')}
                                  </span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => handlePlayAudio(audio.id, audio.url)}
                                className={`flex items-center justify-center w-full px-4 py-2 rounded-lg ${
                                  playingAudio === audio.id
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                                } transition-colors`}
                              >
                                {playingAudio === audio.id ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    <span>Pause</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    <span>Play</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg">
                          <Volume2 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                          <h4 className="text-gray-500 mb-1">No audio clips</h4>
                          <p className="text-sm text-gray-400 mb-4">Add narration to enhance the visitor experience</p>
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=audio`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Audio
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Images section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => toggleSection('images')}
                        className="flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                        <span>Images ({getMediaByType(selectedStop.id, 'image').length})</span>
                        {expandedSections.images ? (
                          <ChevronDown className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronRight className="w-5 h-5 ml-2" />
                        )}
                      </button>
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=image`}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Image
                      </Link>
                    </div>
                    
                    {expandedSections.images && (
                      getMediaByType(selectedStop.id, 'image').length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {getMediaByType(selectedStop.id, 'image').map((image) => (
                            <div key={image.id} className="group relative rounded-lg overflow-hidden aspect-square">
                              <img
                                src={image.url}
                                alt={`Stop ${selectedStop.sequence_no} - ${selectedStop.stop_name}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onClick={() => {
                                  setSelectedImage(image.url);
                                  setShowImageModal(true);
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <div className="flex space-x-2">
                                  <button className="p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-800">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-800">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-800">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg">
                          <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                          <h4 className="text-gray-500 mb-1">No images</h4>
                          <p className="text-sm text-gray-400 mb-4">Add visuals to help visitors identify key points</p>
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=image`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Image
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Videos section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => toggleSection('videos')}
                        className="flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        <Video className="w-5 h-5 mr-2 text-blue-500" />
                        <span>Videos ({getMediaByType(selectedStop.id, 'video').length})</span>
                        {expandedSections.videos ? (
                          <ChevronDown className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronRight className="w-5 h-5 ml-2" />
                        )}
                      </button>
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=video`}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Video
                      </Link>
                    </div>
                    
                    {expandedSections.videos && (
                      getMediaByType(selectedStop.id, 'video').length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {getMediaByType(selectedStop.id, 'video').map((video) => (
                            <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden">
                              <div className="relative pt-[56.25%] bg-black">
                                <video
                                  src={video.url}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  controls
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Video #{video.id}</span>
                                  <div className="flex space-x-2">
                                    <span className="text-sm text-gray-500">
                                      {Math.floor(video.duration_seconds / 60)}:
                                      {(video.duration_seconds % 60).toString().padStart(2, '0')}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg">
                          <Video className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                          <h4 className="text-gray-500 mb-1">No videos</h4>
                          <p className="text-sm text-gray-400 mb-4">Add video clips to demonstrate key features</p>
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=video`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Video
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Stop Selected</h3>
                <p className="text-gray-500 mb-6">Select a stop from the list to view its details</p>
                <Link
                  to={`/guide/tours/${id}/stops/new`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Stop
                </Link>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Tour info */}
          <div className="lg:w-72 xl:w-80 space-y-6">
            {/* Tour info card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    {formatDuration(tour.duration_minutes)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${tour.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <img 
                      src={tour.guide.user.avatar_url} 
                      alt={tour.guide.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{tour.guide.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {tour.guide.years_of_experience} years experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Stop Location</h3>
              </div>
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {selectedStop ? (
                  <div className="text-center p-4">
                    <MapPin className="w-12 h-12 mx-auto text-blue-500 mb-3" />
                    <p className="font-medium">{selectedStop.stop_name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Latitude: {selectedStop.location.lat.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Longitude: {selectedStop.location.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">Select a stop to view location</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Settings className="w-5 h-5 mr-2" />
                  Update Location
                </button>
              </div>
            </div>
            
            {/* Actions card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="flex items-center">
                    <Download className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Download Assets</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="flex items-center">
                    <Share2 className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Share Preview</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="flex items-center">
                    <Eye className="w-5 h-5 text-gray-500 mr-3" />
                    <span>View as Visitor</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingAudio(null)}
        onError={() => {
          console.error('Audio playback error');
          setPlayingAudio(null);
          toast.error('Failed to play audio');
        }}
      />

      {/* Image preview modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex justify-center space-x-3">
              <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;