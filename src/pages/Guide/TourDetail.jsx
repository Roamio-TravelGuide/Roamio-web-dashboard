  import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
  import { useParams, useNavigate, Link } from 'react-router-dom';
  import toast from 'react-hot-toast';
  import { 
    ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X,  
    Check, AlertCircle, Headphones, Image as ImageIcon, User,
    CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight,
    SkipForward, SkipBack, VolumeX, Volume1, RotateCcw, Settings,
    Maximize2, ExternalLink, AlertTriangle, ZoomIn, Download,
    Edit, Trash2, Plus, MoreVertical, Star, Map
  } from 'lucide-react';
  import { TourStopsMap } from '../../components/tour/TourStopsMap';
  import axios from 'axios';
  import { getTourPackageMedia, getMediaUrls } from '../../api/tour/tourApi';

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // StatusBadge component extracted for reusability
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // AudioPlayer component with enhanced controls
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
    onSeek,
    isEditable,
    onEdit,
    onDelete
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
      <div className="overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Headphones className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">Audio #{media.id}</h4>
                <p className="text-xs text-gray-500 truncate">
                  {media.format?.toUpperCase() || 'AUDIO'} • {formatTime(media.duration_seconds)}
                </p>
              </div>
            </div>
            {isEditable && (
              <div className="flex space-x-1">
                <button 
                  onClick={() => onEdit(media)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                  aria-label="Edit audio"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(media.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  aria-label="Delete audio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
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
                onClick={isPlaying ? onPause : onPlay}
                className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
                className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                }}
                aria-label="Volume control"
              />
            </div>
          </div>

          {media.status === 'rejected' && media.rejection_reason && (
            <div className="p-2 mt-2 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1 text-xs font-medium text-red-800">Rejection Reason:</p>
                  <p className="text-xs leading-relaxed text-red-700">{media.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  // ImageGallery component with lazy loading and performance optimizations
  const ImageGallery = React.memo(({ images, onImageClick, isEditable, onEdit, onDelete }) => {
    if (!images?.length) {
      return (
        <div className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="relative p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">No Images Available</h3>
            <p className="text-xs leading-relaxed text-gray-600">
              This tour stop doesn't have any images yet.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer group hover:shadow-md"
            onClick={() => onImageClick(image.url)}
            aria-label={`View image ${index + 1}`}
          >
            <div className="relative h-24 overflow-hidden">
              <img 
                src={image.url} 
                alt={`Stop image ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100" />
              
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <button 
                  className="p-2 transition-colors rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  aria-label="Preview image"
                >
                  <Eye className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900 truncate">
                  Image #{image.id}
                </span>
                <span className="text-xs text-gray-500">
                  #{index + 1}
                </span>
              </div>
              
              {image.status === 'rejected' && image.rejection_reason && (
                <div className="p-1 mt-1 border border-red-200 rounded bg-red-50">
                  <p className="text-xs text-red-700 truncate">{image.rejection_reason}</p>
                </div>
              )}
            </div>

            {isEditable && (
              <div className="absolute flex space-x-1 transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(image);
                  }}
                  className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                  aria-label="Edit image"
                >
                  <Edit className="w-3 h-3 text-gray-700" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                  className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  });

  // TourStopCard component with memoization
  const TourStopCard = React.memo(({ stop, isActive, onClick, isEditable, onEdit, onDelete }) => {
    return (
      <div className={`w-full p-3 rounded-lg border transition-all ${
        isActive
          ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-inner'
          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
      }`}>
        <div className="flex items-start justify-between">
          <button
            onClick={onClick}
            className="flex-1 text-left rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Select stop ${stop.sequence_no}: ${stop.name}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 space-x-2">
                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {stop.sequence_no}
                </span>
                <span className="text-sm font-medium truncate">{stop.name}</span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{stop.allMedia.length} media</span>
            </div>
          </button>
          
          {isEditable && (
            <div className="flex ml-2 space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(stop);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                aria-label="Edit stop"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(stop.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600"
                aria-label="Delete stop"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  });

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
      images: true
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRefreshingMedia, setIsRefreshingMedia] = useState(false);
    
    // Audio player state
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    
    const audioRef = useRef(null);

    const isEditable = useMemo(() => {
      return tour && (tour.status === 'rejected' || tour.status === 'draft');
    }, [tour]);

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

    const MemoizedTourStopsMap = useMemo(() => {
      return (
        <TourStopsMap
          stops={mapStops}
          selectedStopId={selectedStopId}
          onSelectStop={s => setSelectedStopId(s.id)}
        />
      );
    }, [mapStops, selectedStopId]);

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

    useEffect(() => {
      const fetchTour = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`, {
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
    }, [playingAudio]); // Add playingAudio as dependency to ensure proper tracking

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

    const handleDeleteTour = useCallback(async () => {
      if (!isEditable) {
        toast.error('You can only delete tours with rejected or draft status');
        return;
      }

      const confirmDelete = window.confirm('Are you sure you want to delete this tour? This action cannot be undone.');
      if (!confirmDelete) return;
      
      setIsDeleting(true);
      try {
        await axios.delete(`${API_BASE_URL}/tour-packages/${id}`);
        toast.success('Tour deleted successfully');
        navigate('/guide/tours');
      } catch (error) {
        console.error('Error deleting tour:', error);
        toast.error(error.response?.data?.message || 'Failed to delete tour');
      } finally {
        setIsDeleting(false);
      }
    }, [id, isEditable, navigate]);

    const handleEditStop = useCallback((stop) => {
      navigate(`/guide/tours/${id}/stops/${stop.id}/edit`);
    }, [id, navigate]);

    const handleDeleteStop = useCallback(async (stopId) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this stop? This action cannot be undone.');
      if (!confirmDelete) return;
      
      try {
        await axios.delete(`${API_BASE_URL}/tour-packages/${id}/stops/${stopId}`);
        toast.success('Stop deleted successfully');
        // Refresh tour data
        const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`);
        if (response.data?.success) {
          setTour(response.data.data);
          // Reset selected stop if it was deleted
          if (selectedStopId === stopId) {
            setSelectedStopId(response.data.data.tour_stops?.[0]?.id || null);
          }
        }
      } catch (error) {
        console.error('Error deleting stop:', error);
        toast.error(error.response?.data?.message || 'Failed to delete stop');
      }
    }, [id, selectedStopId]);

    const handleEditMedia = useCallback((media) => {
      // Implement media edit logic
      console.log('Edit media:', media);
      toast('Editing media is not implemented yet');
    }, []);

    const handleDeleteMedia = useCallback(async (mediaId) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this media? This action cannot be undone.');
      if (!confirmDelete) return;
      
      try {
        await axios.delete(`${API_BASE_URL}/media/${mediaId}`);
        toast.success('Media deleted successfully');
        // Refresh tour data
        const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`);
        if (response.data?.success) {
          setTour(response.data.data);
        }
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error(error.response?.data?.message || 'Failed to delete media');
      }
    }, [id]);

    const toggleSection = useCallback((section) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

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
            className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-2 py-3 mx-auto max-w-7xl sm:px-3 lg:px-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </button>
              
              {isEditable && (
                <div className="flex gap-2">
                  <Link
                    to={`/guide/tour/edit/${tour.id}`}
                    className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit Tour
                  </Link>
                  <button
                    onClick={handleDeleteTour}
                    disabled={isDeleting}
                    className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1.5" />
                    )}
                    Delete Tour
                  </button>
                </div>
              )}
            </div>

            {/* Compact Tour Info Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Tour Cover Image */}
              <div className="lg:col-span-1">
                {tour.cover_image_url ? (
                  <div className="relative w-full h-32 overflow-hidden rounded-lg shadow-md lg:h-40">
                    <img
                      src={tour.cover_image_url}
                      alt="Tour Cover"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <StatusBadge status={tour.status} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg lg:h-40">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Tour Details */}
              <div className="lg:col-span-2">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">{tour.title}</h1>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700">
                      {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg">💰</span>
                    <span className="font-bold text-green-600">${tour.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-700">{tour.tour_stops?.length || 0} stops</span>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="lg:col-span-1">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Tour Status</h3>
                    <StatusBadge status={tour.status} />
                  </div>
                  
                  {tour.status === 'rejected' && tour.rejection_reason && (
                    <div className="p-2 mt-2 text-xs border border-red-200 rounded bg-red-50">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700">{tour.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                  
                  {isEditable && (
                    <div className="mt-3 space-y-2">
                      <Link
                        to={`/guide/tours/${id}/stops/new`}
                        className="flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add New Stop
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-2 py-6 mx-auto max-w-7xl sm:px-3 lg:px-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left sidebar - Tour stops list */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Tour Stops</h3>
                </div>
                
                {tour.tour_stops?.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {tour.tour_stops.map((stop) => {
                      const allMedia = stop.media?.map(mediaItem => mediaItem.media || mediaItem) || [];
                      return (
                        <TourStopCard
                          key={stop.id}
                          stop={{ ...stop, allMedia }}
                          isActive={selectedStopId === stop.id}
                          onClick={() => setSelectedStopId(stop.id)}
                          isEditable={isEditable}
                          onEdit={() => handleEditStop(stop)}
                          onDelete={() => handleDeleteStop(stop.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-gray-400 bg-gray-100 rounded-full">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-gray-500">No stops added</h4>
                    <p className="mb-4 text-sm text-gray-400">Add stops to create your tour</p>
                    {isEditable && (
                      <Link
                        to={`/guide/tours/${id}/stops/new`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Stop
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content - Selected stop details */}
            <div className="lg:col-span-1">
              {selectedStop ? (
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Stop {selectedStop.sequence_no}: {selectedStop.stop_name}
                      </h3>
                      {isEditable && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStop(selectedStop)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            aria-label="Edit stop"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStop(selectedStop.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            aria-label="Delete stop"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {selectedStop.description && (
                      <p className="mb-4 text-sm text-gray-600">{selectedStop.description}</p>
                    )}
                    
                    {/* Audio Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="flex items-center text-sm font-semibold text-gray-900">
                          <Headphones className="w-4 h-4 mr-2 text-blue-600" />
                          Audio Narration
                        </h4>
                        {isEditable && (
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=audio`}
                            className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Audio
                          </Link>
                        )}
                      </div>
                      
                      {getMediaByType(selectedStop.id, 'audio').length > 0 ? (
                        <div className="space-y-3">
                          {getMediaByType(selectedStop.id, 'audio').map((audio) => (
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
                              isEditable={isEditable}
                              onEdit={handleEditMedia}
                              onDelete={handleDeleteMedia}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 text-gray-400 bg-gray-200 rounded-full">
                            <Headphones className="w-5 h-5" />
                          </div>
                          <p className="text-sm text-gray-500">No audio narration added</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Images Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="flex items-center text-sm font-semibold text-gray-900">
                          <ImageIcon className="w-4 h-4 mr-2 text-green-600" />
                          Image Gallery
                        </h4>
                        {isEditable && (
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=image`}
                            className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Image
                          </Link>
                        )}
                      </div>
                      
                      <ImageGallery
                        images={getMediaByType(selectedStop.id, 'image')}
                        onImageClick={(imageUrl) => {
                          setSelectedImage(imageUrl);
                          setShowImageModal(true);
                        }}
                        isEditable={isEditable}
                        onEdit={handleEditMedia}
                        onDelete={handleDeleteMedia}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 text-gray-400 bg-gray-100 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-700">No stop selected</h3>
                  <p className="mb-4 text-sm text-gray-500">Select a stop from the list to view details</p>
                  {isEditable && (
                    <Link
                      to={`/guide/tours/${id}/stops/new`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Stop
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* Right sidebar - Map */}
            <div className="lg:col-span-1">
              <div className="sticky overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm top-8">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tour Route Map</h3>
                    <button
                      onClick={handleRefreshMedia}
                      disabled={isRefreshingMedia}
                      className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      aria-label="Refresh media"
                    >
                      {isRefreshingMedia ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {selectedStop && (
                    <p className="mt-1 text-xs text-gray-500">
                      Currently viewing: <span className="font-medium">{selectedStop.stop_name}</span>
                    </p>
                  )}
                </div>
                <div className="h-96">
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
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute right-0 text-white -top-10 hover:text-gray-300 focus:outline-none"
                aria-label="Close image preview"
              >
                <XCircle className="w-8 h-8" />
              </button>
              <img 
                src={selectedImage} 
                alt="Full size view"
                className="object-contain max-w-full max-h-[80vh] rounded-lg"
                loading="eager"
              />
              {isEditable && (
                <div className="flex justify-center mt-4 space-x-3">
                  <button
                    onClick={() => {
                      // Implement download functionality
                      const link = document.createElement('a');
                      link.href = selectedImage;
                      link.download = `tour-stop-image-${Date.now()}`;
                      link.click();
                    }}
                    className="flex items-center px-3 py-1.5 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      toast('Edit image functionality coming soon');
                    }}
                    className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default TourDetail;