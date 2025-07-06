import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X, 
  Check, AlertCircle, Headphones, Image as ImageIcon, Video, User,
  CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight
} from 'lucide-react';
import TourStopsMap from '../../components/tour/TourStopsMap';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const StatusBadge = ({ status }) => {
  const config = {
    pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
    published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' }
  }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const MediaCard = ({ media, onPlay, onPreview, isPlaying = false }) => {
  const getMediaIcon = () => {
    switch (media.media_type) {
      case 'audio': return <Volume2 className="w-5 h-5 text-blue-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      default: return <Volume2 className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-xs">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-50">
            {getMediaIcon()}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {media.media_type === 'audio' ? 'Audio' : media.media_type === 'image' ? 'Image' : 'Video'} #{media.id}
            </h4>
            {media.duration_seconds && (
              <p className="text-sm text-gray-500">Duration: {formatDuration(media.duration_seconds)}</p>
            )}
            {media.format && <p className="text-sm text-gray-500">Format: {media.format}</p>}
          </div>
        </div>
        <StatusBadge status={media.status || 'pending'} />
      </div>

      {media.media_type === 'audio' && onPlay && (
        <button 
          onClick={onPlay}
          className="flex items-center justify-center w-full px-4 py-2 mb-3 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      )}

      {media.media_type === 'image' && onPreview && (
        <div className="mb-3">
          <img 
            src={media.url} 
            alt={`Image ${media.id}`}
            className="object-cover w-full h-40 rounded-lg cursor-pointer hover:opacity-90"
            onClick={onPreview}
          />
          <button 
            onClick={onPreview}
            className="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            <Eye className="w-4 h-4" />
            <span>View Full Size</span>
          </button>
        </div>
      )}

      {media.media_type === 'video' && (
        <div className="w-full h-40 mb-3 overflow-hidden bg-black rounded-lg">
          <video 
            src={media.url} 
            className="object-cover w-full h-full"
            controls
            preload="metadata"
          />
        </div>
      )}

      {media.status === 'rejected' && media.rejection_reason && (
        <div className="p-3 mb-3 border border-red-200 rounded-lg bg-red-50">
          <p className="mb-1 text-sm font-medium text-red-800">Rejection Reason:</p>
          <p className="text-sm text-red-700">{media.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};

const TourStopCard = ({ stop, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isActive
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            {stop.sequence_no}
          </span>
          <span className="font-medium truncate">{stop.name}</span>
        </div>
        <span className="text-xs text-gray-500">{stop.allMedia.length} media</span>
      </div>
    </button>
  );
};

const TourRejectModal = ({ isOpen, onClose, reason, onReasonChange, onConfirm, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reject Tour Package</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mb-4 text-gray-600">
            You're about to reject this entire tour package. Please provide a reason.
          </p>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Please provide a detailed reason for rejection..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
            autoFocus
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!reason.trim() || isSubmitting}
              className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 ${
                reason.trim() && !isSubmitting
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute right-0 text-white -top-10 hover:text-gray-300"
        >
          <XCircle className="w-8 h-8" />
        </button>
        <img 
          src={imageUrl} 
          alt="Full size view"
          className="object-contain max-w-full max-h-full rounded-lg"
        />
      </div>
    </div>
  );
};

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    audio: true,
    images: true,
    videos: true
  });
  const [showTourRejectModal, setShowTourRejectModal] = useState(false);
  const [tourRejectReason, setTourRejectReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching tour with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`, {
          timeout: 10000
        });
        
        console.log('API Response:', response.data);
        
        if (!response.data?.success || !response.data?.data) {
          throw new Error('Invalid tour data received');
        }

        const data = response.data.data;
        setTour(data);
        
        if (!selectedStopId && data.tour_stops?.[0]) {
          setSelectedStopId(data.tour_stops[0].id);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        let errorMessage = 'Failed to load tour details. Please try again.';
        
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. Please check your connection.';
          } else if (error.response?.status === 404) {
            errorMessage = 'Tour not found.';
          } else if (error.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTour();
  }, [id]);

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

  const handleApproveTour = async () => {
    if (!tour || !id || isApproving) return;
    
    setIsApproving(true);
    const toastId = toast.loading('Approving tour...');
    
    try {
      console.log(`Attempting to approve tour ${id}...`);

      const response = await axios.patch(
        `${API_BASE_URL}/tour-packages/${id}/status`,
        { status: 'published' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      console.log('Approval response received:', response.data);

      if (response.status === 200 && response.data?.success) {
        setTour(prevTour => {
          if (!prevTour) return null;
          
          return {
            ...prevTour,
            status: 'published',
            rejection_reason: undefined,
            tour_stops: prevTour.tour_stops
          };
        });
        
        setError(null);
        
        toast.success('🎉 Tour approved successfully! The tour is now published and available to users.', { 
          id: toastId,
          duration: 5000
        });
      } else {
        throw new Error(response.data?.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Approval failed:', error);
      
      let errorMessage = 'Failed to approve tour. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Please check your connection.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Tour not found. It may have been deleted.';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectTour = () => {
    setShowTourRejectModal(true);
    setTourRejectReason('');
  };

  const confirmRejectTour = async () => {
    if (!tour || !id || !tourRejectReason.trim() || isRejecting) return;

    setIsRejecting(true);
    const toastId = toast.loading('Rejecting tour...');

    try {
      console.log(`Attempting to reject tour ${id}...`);
      console.log('Rejection reason:', tourRejectReason);

      const response = await axios.patch(
        `${API_BASE_URL}/tour-packages/${id}/status`,
        {
          status: 'rejected',
          rejection_reason: tourRejectReason
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      console.log('Rejection response:', response.data);

      if (response.status === 200 && response.data?.success) {
        setTour(prevTour => {
          if (!prevTour) return null;
          
          return {
            ...prevTour,
            status: 'rejected',
            rejection_reason: tourRejectReason,
            tour_stops: prevTour.tour_stops
          };
        });
        
        setShowTourRejectModal(false);
        setTourRejectReason('');
        setError(null);
        
        toast.success('✅ Tour rejected successfully. The guide has been notified with your feedback.', { 
          id: toastId,
          duration: 5000
        });
      } else {
        throw new Error(response.data?.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      
      let errorMessage = 'Failed to reject tour. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Please check your connection.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Tour not found. It may have been deleted.';
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid request data. Please check the rejection reason.';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsRejecting(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getMediaByType = (stopId, type) => {
    const stop = tour?.tour_stops?.find(s => s.id === stopId);
    return stop?.media.filter(m => m.media_type === type) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
          <div className="text-lg text-gray-600">Loading tour details...</div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="p-6 bg-gray-50">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Tour not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedStop = tour.tour_stops?.find(stop => stop.id === selectedStopId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Status:</span>
              <StatusBadge status={tour.status} />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{tour.title}</h1>
              <p className="mt-2 text-gray-600">{tour.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{tour.guide?.user?.name || 'Unknown Guide'}</span>
                  {tour.guide?.years_of_experience && (
                    <span className="text-sm text-gray-500">({tour.guide.years_of_experience} yrs exp)</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">${tour.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {tour.guide?.user?.avatar_url && (
              <img 
                src={tour.guide.user.avatar_url} 
                alt={tour.guide.user.name}
                className="w-16 h-16 border-2 border-gray-200 rounded-full"
              />
            )}
          </div>

          {tour.status === 'rejected' && tour.rejection_reason && (
            <div className="p-4 mt-6 border border-red-200 rounded-lg bg-red-50">
              <h3 className="mb-2 text-sm font-medium text-red-800">Rejection Reason:</h3>
              <p className="text-sm text-red-700">{tour.rejection_reason}</p>
            </div>
          )}

          {tour.status === 'pending_approval' && (
            <div className="flex mt-6 space-x-3">
              <button
                onClick={handleApproveTour}
                disabled={isApproving || isRejecting}
                className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{isApproving ? 'Approving...' : 'Approve Tour'}</span>
              </button>
              <button
                onClick={handleRejectTour}
                disabled={isApproving || isRejecting}
                className="flex items-center px-4 py-2 space-x-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Tour</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-220px)]">
        <div className="overflow-y-auto bg-white border-r border-gray-200 lg:w-1/3 xl:w-1/4">
          <div className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tour Stops ({tour.tour_stops?.length || 0})</h2>
          </div>
          <div className="p-4 space-y-2">
            {tour.tour_stops?.map((stop) => (
              <TourStopCard
                key={stop.id}
                stop={{
                  id: stop.id,
                  sequence_no: stop.sequence_no,
                  name: stop.stop_name,
                  description: stop.description || '',
                  audioClips: stop.media.filter(m => m.media_type === 'audio'),
                  images: stop.media.filter(m => m.media_type === 'image'),
                  videos: stop.media.filter(m => m.media_type === 'video'),
                  allMedia: stop.media
                }}
                isActive={selectedStopId === stop.id}
                onClick={() => setSelectedStopId(stop.id)}
              />
            ))}
          </div>
        </div>

        {selectedStop && (
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-3 space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900">{selectedStop.stop_name}</h2>
                  <span className="text-sm text-gray-500">Stop #{selectedStop.sequence_no}</span>
                </div>
                <p className="text-gray-600">{selectedStop.description}</p>
              </div>

              <div className="mb-8">
                <button 
                  onClick={() => toggleSection('audio')}
                  className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
                >
                  <Headphones className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Audio Narration ({getMediaByType(selectedStop.id, 'audio').length})</span>
                  {expandedSections.audio ? (
                    <ChevronDown className="w-5 h-5 ml-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 ml-2" />
                  )}
                </button>
                
                {expandedSections.audio && (
                  getMediaByType(selectedStop.id, 'audio').length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {getMediaByType(selectedStop.id, 'audio').map((audio) => (
                        <MediaCard
                          key={audio.id}
                          media={audio}
                          onPlay={() => handlePlayAudio(audio.id, audio.url)}
                          isPlaying={playingAudio === audio.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
                      No audio clips available
                    </div>
                  )
                )}
              </div>

              <div className="mb-8">
                <button 
                  onClick={() => toggleSection('images')}
                  className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
                >
                  <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Images ({getMediaByType(selectedStop.id, 'image').length})</span>
                  {expandedSections.images ? (
                    <ChevronDown className="w-5 h-5 ml-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 ml-2" />
                  )}
                </button>
                
                {expandedSections.images && (
                  getMediaByType(selectedStop.id, 'image').length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {getMediaByType(selectedStop.id, 'image').map((image) => (
                        <MediaCard
                          key={image.id}
                          media={image}
                          onPreview={() => {
                            setSelectedImage(image.url);
                            setShowImageModal(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
                      No images available
                    </div>
                  )
                )}
              </div>

              <div>
                <button 
                  onClick={() => toggleSection('videos')}
                  className="flex items-center w-full mb-4 text-lg font-semibold text-gray-900"
                >
                  <Video className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Videos ({getMediaByType(selectedStop.id, 'video').length})</span>
                  {expandedSections.videos ? (
                    <ChevronDown className="w-5 h-5 ml-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 ml-2" />
                  )}
                </button>
                
                {expandedSections.videos && (
                  getMediaByType(selectedStop.id, 'video').length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {getMediaByType(selectedStop.id, 'video').map((video) => (
                        <MediaCard
                          key={video.id}
                          media={video}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
                      No videos available
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <div className="hidden bg-gray-100 border-l border-gray-200 lg:w-1/3 xl:w-2/5 lg:block">
          <div className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tour Route Map</h2>
            {selectedStop && (
              <p className="mt-1 text-sm text-gray-600">
                {selectedStop.stop_name} - Stop #{selectedStop.sequence_no}
              </p>
            )}
          </div>
          <div className="relative h-full" style={{ minHeight: 400 }}>
            <TourStopsMap
              stops={tour.tour_stops?.map(stop => ({
                ...stop,
                // Ensure location is present and valid
                location: stop.location || { latitude: 0, longitude: 0 },
              })) || []}
              selectedStopId={selectedStopId}
              onSelectStop={s => setSelectedStopId(s.id)}
            />
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingAudio(null)}
        onError={() => {
          console.error('Audio playback error');
          setPlayingAudio(null);
          toast.error('Failed to play audio');
        }}
      />

      <TourRejectModal
        isOpen={showTourRejectModal}
        onClose={() => {
          if (!isRejecting) {
            setShowTourRejectModal(false);
            setTourRejectReason('');
          }
        }}
        reason={tourRejectReason}
        onReasonChange={setTourRejectReason}
        onConfirm={confirmRejectTour}
        isSubmitting={isRejecting}
      />

      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
};

export default TourDetail;