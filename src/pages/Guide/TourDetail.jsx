import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X,  
  Check, AlertCircle, Headphones, Image as ImageIcon, User,
  CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight,
  SkipForward, SkipBack, VolumeX, Volume1, RotateCcw, Settings,
  Maximize2, ExternalLink, AlertTriangle, ZoomIn, Download,
  Edit, Trash2, Clock as ClockIcon, AlertOctagon, ThumbsUp
} from 'lucide-react';
import { TourStopsMap } from '../../components/tour/TourStopsMap';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Enhanced StatusBadge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-800', 
      icon: <ClockIcon className="w-3 h-3 mr-1" />, 
      label: 'Pending Approval' 
    },
    published: { 
      bg: 'bg-green-50 border-green-200', 
      text: 'text-green-800', 
      icon: <CheckCircle className="w-3 h-3 mr-1" />, 
      label: 'Published' 
    },
    rejected: { 
      bg: 'bg-red-50 border-red-200', 
      text: 'text-red-800', 
      icon: <XCircle className="w-3 h-3 mr-1" />, 
      label: 'Rejected' 
    },
    pending: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-800', 
      icon: <ClockIcon className="w-3 h-3 mr-1" />, 
      label: 'Pending' 
    },
    approved: { 
      bg: 'bg-green-50 border-green-200', 
      text: 'text-green-800', 
      icon: <ThumbsUp className="w-3 h-3 mr-1" />, 
      label: 'Approved' 
    }
  };

  const config = statusConfig[status] || { 
    bg: 'bg-gray-50 border-gray-200', 
    text: 'text-gray-800', 
    icon: <AlertOctagon className="w-3 h-3 mr-1" />, 
    label: 'Unknown' 
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="flex items-center mr-1.5">{config.icon}</span>
      {config.label}
    </div>
  );
};

// Enhanced AudioPlayer component
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

  return (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-0.5 rounded-lg bg-blue-50">
            <Headphones className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Audio Narration</h4>
            <p className="text-xs text-gray-500">
              {media.format?.toUpperCase() || 'AUDIO'} • {formatTime(media.duration_seconds)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div 
          className="relative w-full h-2 bg-gray-100 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className={`absolute top-1/2 w-3 h-3 -mt-1.5 border-2 border-white rounded-full shadow-sm transform transition-all ${
              isPlaying ? 'bg-red-500 scale-110' : 'bg-blue-600'
            }`}
            style={{ left: `${Math.max(1, Math.min(progressPercentage, 97))}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className={`font-medium ${isPlaying ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(currentTime)}
          </span>
          <span className="text-gray-500">
            {formatTime(duration || media.duration_seconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <select
              value={playbackRate}
              onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
              className="px-2 py-1 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Playback speed"
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
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
            }}
            aria-label="Volume control"
          />
        </div>
      </div>

      {media.status === 'rejected' && media.rejection_reason && (
        <div className="p-3 mt-3 text-sm border border-red-100 rounded-lg bg-red-50">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Rejection Reason:</p>
              <p className="text-red-700">{media.rejection_reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const RejectionNotice = ({ type, reason }) => {
  const typeConfig = {
    audio: {
      icon: <Headphones className="w-5 h-5 text-red-500" />,
      title: "Audio Rejection",
      bg: "bg-red-50",
      border: "border-l-4 border-red-500",
      badge: "bg-red-100 text-red-800"
    },
    image: {
      icon: <ImageIcon className="w-5 h-5 text-red-500" />,
      title: "Image Rejection",
      bg: "bg-red-50",
      border: "border-l-4 border-red-500",
      badge: "bg-red-100 text-red-800"
    },
    general: {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Rejection Summary",
      bg: "bg-red-50",
      border: "border-l-4 border-red-500",
      badge: "bg-red-100 text-red-800"
    }
  };

  const config = typeConfig[type] || typeConfig.general;

  return (
    <div className={`p-4 rounded-lg ${config.bg} ${config.border} shadow-xs`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {config.icon}
        </div>
        <div className="flex-1 ml-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-red-800">{config.title}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              Requires Action
            </span>
          </div>
          <div className="p-3 mt-2 bg-white border border-red-100 rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{reason}</p>
          </div>
          <div className="mt-2 text-xs text-red-700">
            <p>Please address these issues and resubmit for approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced ImageGallery component
const ImageGallery = React.memo(({ images, onImageClick }) => {
  if (!images?.length) {
    return (
      <div className="p-6 text-center bg-white border border-gray-100 rounded-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-full">
          <ImageIcon className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">No Images Available</h3>
        <p className="mt-1 text-xs text-gray-500">
          This tour stop doesn't have any images yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={`${image.id}-${index}`}
          className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-xs group"
        >
          <div 
            className="relative overflow-hidden cursor-pointer h-28"
            onClick={() => onImageClick(image.url)}
          >
            <img 
              src={image.url} 
              alt={`Stop image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100" />
            
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="p-1.5 bg-white rounded-full shadow-sm">
                <Eye className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 truncate">
                Image #{image.id}
              </span>
              <span className="text-xs text-gray-400">
                #{index + 1}
              </span>
            </div>
            
            {image.status === 'rejected' && image.rejection_reason && (
              <div className="p-1.5 mt-1 text-xs border border-red-100 rounded bg-red-50">
                <p className="text-red-700 truncate">{image.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

// Enhanced TourStopCard component
const TourStopCard = React.memo(({ stop, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isActive
          ? 'border-blue-200 bg-blue-50 shadow-inner'
          : 'border-gray-100 bg-white hover:border-gray-200'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={`Select stop ${stop.sequence_no}: ${stop.name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 space-x-3">
          <div className={`flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-medium rounded-full ${
            isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {stop.sequence_no}
          </div>
          <div className="min-w-0">
            <h4 className={`text-sm font-medium truncate ${
              isActive ? 'text-blue-800' : 'text-gray-700'
            }`}>
              {stop.name}
            </h4>
            <p className={`text-xs truncate ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {stop.allMedia.length} media items
            </p>
          </div>
        </div>
      </div>
    </button>
  );
});

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-0 text-white transition-colors -top-10 hover:text-gray-300"
          aria-label="Close image preview"
        >
          <XCircle className="w-8 h-8" />
        </button>
        <img 
          src={imageUrl} 
          alt="Full size view"
          className="object-contain max-w-full max-h-[80vh] rounded-lg"
          loading="eager"
        />
      </div>
    </div>
  );
};

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel",
  isProcessing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TourDetail component
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshingMedia, setIsRefreshingMedia] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Audio player state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef(null);

  // Memoize the map stops
  const mapStops = useMemo(() => {
    if (!tour?.tour_stops) return [];
    
    return tour.tour_stops.map(stop => ({
      id: stop.id,
      sequence_no: stop.sequence_no,
      stop_name: stop.stop_name,
      description: stop.description,
      location: stop.location || { latitude: 0, longitude: 0 },
    }));
  }, [tour?.tour_stops]);

  // Memoize the TourStopsMap component
  const MemoizedTourStopsMap = useMemo(() => {
    return (
      <TourStopsMap
        stops={mapStops}
        selectedStopId={selectedStopId}
        onSelectStop={s => setSelectedStopId(s.id)}
      />
    );
  }, [mapStops, selectedStopId]);

  // Refresh media URLs with fresh signed URLs
  const refreshMediaUrls = useCallback(async (tourData) => {
    try {
      if (!tourData) return tourData;

      const mediaResponse = await getTourPackageMedia(tourData.id);
      
      if (mediaResponse.success && mediaResponse.data) {
        const freshMediaData = mediaResponse.data;
        
        if (freshMediaData.cover_image) {
          tourData.cover_image_url = freshMediaData.cover_image.url;
          if (tourData.cover_image) {
            tourData.cover_image.url = freshMediaData.cover_image.url;
          }
        }

        if (freshMediaData.tour_stops && tourData.tour_stops) {
          tourData.tour_stops.forEach((stop, stopIndex) => {
            const freshStop = freshMediaData.tour_stops[stopIndex];
            if (freshStop && freshStop.media) {
              stop.media = freshStop.media;
            }
          });
        }
      }

      return tourData;
    } catch (error) {
      console.error('Error refreshing media URLs:', error);
      return tourData;
    }
  }, []);

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/tour-package/${id}`, {
          timeout: 10000
        });
        
        if (!response.data?.success || !response.data?.data) {
          throw new Error('Invalid tour data received');
        }

        const data = response.data.data;
        const enrichedData = await refreshMediaUrls(data);
        
        setTour(enrichedData);
        
        if (!selectedStopId && enrichedData.tour_stops?.[0]) {
          setSelectedStopId(enrichedData.tour_stops[0].id);
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
  }, [id, refreshMediaUrls, selectedStopId]);

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
    const handleError = () => {
      console.error('Audio playback error');
      setPlayingAudio(null);
      toast.error('Failed to play audio');
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
    try {
      if (playingAudio === mediaId) {
        audioRef.current?.pause();
        setPlayingAudio(null);
      } else {
        // Reset current time when switching audio files
        setCurrentTime(0);
        setPlayingAudio(mediaId);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => {
            console.error('Audio play failed:', error);
            toast.error('Failed to play audio');
            setPlayingAudio(null);
          });
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
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleEditTour = useCallback(() => {
    if (!tour) return;
      navigate(`/guide/tour/edit/${tour.id}`, { state: { tour } });
  }, [tour, navigate]);

  const handleDeleteTour = useCallback(async () => {
    if (!tour || !id || isDeleting) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting tour...');

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/tour-packages/${id}`
      );

      if (response.status === 200 && response.data?.success) {
        toast.success('Tour deleted successfully!', { 
          id: toastId,
          duration: 3000
        });
        navigate('/tours');
      } else {
        throw new Error(response.data?.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      
      let errorMessage = 'Failed to delete tour. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Please check your connection.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Tour not found. It may have already been deleted.';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [tour, id, isDeleting, navigate]);

  const getMediaByType = useCallback((stopId, type) => {
    const stop = tour?.tour_stops?.find(s => s.id === stopId);
    if (!stop?.media) return [];
    
    return stop.media
      .map(mediaItem => mediaItem.media || mediaItem)
      .filter(m => m && m.media_type === type) || [];
  }, [tour?.tour_stops]);

  // Manual refresh function for media URLs
  const handleRefreshMedia = useCallback(async () => {
    if (!tour || isRefreshingMedia) return;
    
    setIsRefreshingMedia(true);
    const toastId = toast.loading('Refreshing media URLs...');
    
    try {
      const refreshedTour = await refreshMediaUrls(tour);
      setTour(refreshedTour);
      toast.success('Media URLs refreshed successfully!', { id: toastId });
    } catch (error) {
      console.error('Error refreshing media:', error);
      toast.error('Failed to refresh media URLs', { id: toastId });
    } finally {
      setIsRefreshingMedia(false);
    }
  }, [tour, isRefreshingMedia, refreshMediaUrls]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center bg-white border border-gray-100 rounded-lg shadow-xs">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
          <h3 className="text-lg font-medium text-gray-700">Loading Tour Details</h3>
          <p className="text-sm text-gray-500">Please wait while we load your tour information</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="p-6 bg-gray-50">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="p-4 text-red-600 border border-red-100 rounded-lg bg-red-50">
          <div className="flex items-center justify-center space-x-2">
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
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </button>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">{tour.title}</h1>
            </div>
            
            {/* Only show Edit/Delete buttons if tour is rejected */}
            {tour.status === 'rejected' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleEditTour}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit Trip
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete Trip
                </button>
              </div>
            )}
          </div>

          {/* Tour Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Tour Cover Image */}
            <div className="md:col-span-1">
              {tour.cover_image_url ? (
                <div className="relative w-full h-40 overflow-hidden border border-gray-200 rounded-lg shadow-xs">
                  <img
                    src={tour.cover_image_url}
                    alt="Tour Cover"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <StatusBadge status={tour.status} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-40 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Tour Details */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs md:col-span-2">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Tour Overview</h2>
                <p className="mt-1 text-sm text-gray-600">{tour.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-700">
                      {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                    <span className="text-green-600">💰</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-medium text-gray-700">${tour.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stops</p>
                    <p className="text-sm font-medium text-gray-700">{tour.tour_stops?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50">
                    <User className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created By</p>
                    <p className="text-sm font-medium text-gray-700">You</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            <div className="md:col-span-1">
              <div className="h-full p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
                <div className="flex items-center space-x-3">
                  {tour.guide?.user?.avatar_url ? (
                    <img
                      src={tour.guide.user.avatar_url}
                      alt={tour.guide.user.name}
                      className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border-2 border-white rounded-full">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {tour.guide?.user?.name || 'Unknown Guide'}
                    </h3>
                    {tour.guide?.years_of_experience && (
                      <p className="text-xs text-gray-600">{tour.guide.years_of_experience} yrs exp</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tour-Level Rejection */}
          {tour.status === 'rejected' && tour.rejection_reason && (
            <div className="mt-6">
              <RejectionNotice 
                type="general" 
                reason={tour.rejection_reason} 
              />
              
              <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-semibold text-blue-800">Next Steps</h4>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">1</span>
                    Review all rejection notices carefully
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">2</span>
                    Make the necessary corrections to your content
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">3</span>
                    Ensure all media meets quality guidelines
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">4</span>
                    Resubmit for approval when ready
                  </li>
                </ol>
                <div className="pt-3 mt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    Need help? Contact our support team for clarification on any rejection reasons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Combined Tour Stops + Media Content */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {tour.tour_stops?.map((stop) => {
                const allMedia = stop.media?.map(mediaItem => mediaItem.media || mediaItem) || [];
                const audioMedia = allMedia.filter(m => m.media_type === 'audio');
                const imageMedia = allMedia.filter(m => m.media_type === 'image');
                const isSelected = selectedStopId === stop.id;
                
                return (
                  <div
                    key={stop.id}
                    className={`bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-300 shadow-lg ring-2 ring-blue-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Stop Header - Clickable */}
                    <button
                      onClick={() => setSelectedStopId(stop.id)}
                      className="w-full p-4 text-left transition-colors hover:bg-gray-50 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                          isSelected 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {stop.sequence_no}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-bold mb-1 ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {stop.stop_name}
                          </h3>
                          <p className="mb-2 text-sm text-gray-600">{stop.description}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-gray-500">{allMedia.length} media files</span>
                            {audioMedia.length > 0 && (
                              <span className="flex items-center space-x-1 text-blue-600">
                                <Headphones className="w-3 h-3" />
                                <span>{audioMedia.length}</span>
                              </span>
                            )}
                            {imageMedia.length > 0 && (
                              <span className="flex items-center space-x-1 text-green-600">
                                <ImageIcon className="w-3 h-3" />
                                <span>{imageMedia.length}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <ChevronDown className="w-5 h-5 text-blue-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Media Content - Only show if selected */}
                    {isSelected && (
                      <div className="border-t border-gray-200">
                        {/* Audio Section */}
                        {audioMedia.length > 0 && (
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center mb-3 space-x-2">
                              <Headphones className="w-4 h-4 text-blue-600" />
                              <h4 className="text-sm font-semibold text-gray-900">Audio Narration</h4>
                              <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                                {audioMedia.length}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {audioMedia.map((audio) => (
                                <AudioPlayer
                                  key={audio.id}
                                  media={audio}
                                  isPlaying={playingAudio === audio.id}
                                  onPlay={() => handlePlayAudio(audio.id, audio.url)}
                                  onPause={handlePauseAudio}
                                  currentTime={playingAudio === audio.id ? currentTime : 0}
                                  duration={playingAudio === audio.id ? duration : audio.duration_seconds || 0}
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

                        {/* Images Section */}
                        {imageMedia.length > 0 && (
                          <div className="p-4">
                            <div className="flex items-center mb-3 space-x-2">
                              <ImageIcon className="w-4 h-4 text-green-600" />
                              <h4 className="text-sm font-semibold text-gray-900">Image Gallery</h4>
                              <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                                {imageMedia.length}
                              </span>
                            </div>
                            <ImageGallery
                              images={imageMedia}
                              onImageClick={(imageUrl) => {
                                setSelectedImage(imageUrl);
                                setShowImageModal(true);
                              }}
                            />
                          </div>
                        )}

                        {/* No Media State */}
                        {allMedia.length === 0 && (
                          <div className="p-6 text-center text-gray-500">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
                              <AlertCircle className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium">No Media Available</p>
                            <p className="text-xs">This stop doesn't have any media content yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* No stops message */}
              {(!tour.tour_stops || tour.tour_stops.length === 0) && (
                <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">No Tour Stops</h3>
                  <p className="text-gray-500">This tour doesn't have any stops configured yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1">
            <div className="sticky bg-white border border-gray-200 shadow-sm rounded-xl top-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Tour Route Map</h3>
                  <button
                    onClick={handleRefreshMedia}
                    disabled={isRefreshingMedia}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh media URLs"
                  >
                    {isRefreshingMedia ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {selectedStop && (
                  <p className="text-sm text-gray-500">
                    Currently viewing: <span className="font-medium">{selectedStop.stop_name}</span>
                  </p>
                )}
              </div>
              <div className="overflow-hidden h-96 rounded-b-xl">
                {MemoizedTourStopsMap}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        aria-hidden="true"
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setShowImageModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTour}
        title="Delete Tour Permanently"
        message="Are you sure you want to delete this tour? This action cannot be undone. All associated stops, media, and data will be permanently removed."
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default TourDetail;