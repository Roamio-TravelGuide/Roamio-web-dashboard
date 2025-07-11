import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X,  
  Check, AlertCircle, Headphones, Image as ImageIcon, Video, User,
  CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight,
  SkipForward, SkipBack, VolumeX, Volume1, RotateCcw, Settings,
  Maximize2, ExternalLink, AlertTriangle
} from 'lucide-react';
import {TourStopsMap} from '../../components/tour/TourStopsMap';
import axios from 'axios';
import { getTourPackageMedia, getMediaUrls } from '../../api/tour/tourApi';

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

const AdvancedAudioPlayer = ({ 
  audio, 
  isPlaying, 
  onPlay, 
  onPause, 
  onSeek, 
  currentTime = 0, 
  duration = 0,
  volume = 1,
  onVolumeChange,
  playbackRate = 1,
  onPlaybackRateChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    onSeek(Math.max(0, Math.min(newTime, duration)));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  return (
    <div className="w-full p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-200 rounded-xl">
      {/* Audio Info Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Audio Guide #{audio.id}</h4>
            <p className="text-xs text-gray-600">{audio.format} • {formatTime(duration)}</p>
          </div>
        </div>
        <StatusBadge status={audio.status || 'pending'} />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          ref={progressRef}
          className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
          
          {/* Progress track */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          
          {/* Progress handle */}
          <div 
            className="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg transform -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `calc(${progressPercentage}% - 8px)` }}
          ></div>
        </div>
        
        {/* Time labels */}
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center space-x-2">
          {/* Skip backward */}
          <button 
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Skip back 10s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button 
            onClick={isPlaying ? onPause : onPlay}
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Skip forward */}
          <button 
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Skip forward 10s"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center space-x-2">
          {/* Volume control */}
          <div className="relative">
            <button 
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {getVolumeIcon()}
            </button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-12 right-0 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="w-20">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Speed control */}
          <div className="relative">
            <button 
              onClick={() => setShowSpeedOptions(!showSpeedOptions)}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {playbackRate}x
            </button>
            
            {showSpeedOptions && (
              <div className="absolute bottom-12 right-0 p-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-1">
                  {speedOptions.map(speed => (
                    <button
                      key={speed}
                      onClick={() => {
                        onPlaybackRateChange(speed);
                        setShowSpeedOptions(false);
                      }}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        playbackRate === speed 
                          ? 'bg-blue-100 text-blue-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <button 
            onClick={() => onSeek(0)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rejection reason if rejected */}
      {audio.status === 'rejected' && audio.rejection_reason && (
        <div className="p-2 mt-3 text-xs border border-red-200 rounded-lg bg-red-50">
          <p className="font-medium text-red-800">Rejection Reason:</p>
          <p className="text-red-700">{audio.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};

const MediaCard = ({ 
  media, 
  onPlay, 
  onPause, 
  onSeek, 
  onPreview, 
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange,
  playbackRate = 1,
  onPlaybackRateChange
}) => {
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

  // For audio files, use the advanced audio player
  if (media.media_type === 'audio') {
    return (
      <AdvancedAudioPlayer
        audio={media}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onVolumeChange={onVolumeChange}
        playbackRate={playbackRate}
        onPlaybackRateChange={onPlaybackRateChange}
      />
    );
  }

  // For non-audio media, use the existing card design
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-50">
            {getMediaIcon()}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-medium text-gray-900 truncate">
              {media.media_type === 'image' ? 'Image' : 'Video'} #{media.id}
            </h4>
            <div className="flex flex-wrap gap-x-2 mt-1">
              {media.duration_seconds && (
                <p className="text-xs text-gray-500">Duration: {formatDuration(media.duration_seconds)}</p>
              )}
              {media.format && <p className="text-xs text-gray-500">Format: {media.format}</p>}
              {media.file_size && <p className="text-xs text-gray-500">Size: {(media.file_size / (1024*1024)).toFixed(1)}MB</p>}
            </div>
          </div>
        </div>
        <StatusBadge status={media.status || 'pending'} />
      </div>

      {media.media_type === 'image' && onPreview && (
        <div className="mb-3">
          <div className="relative overflow-hidden rounded-lg group">
            <img 
              src={media.url} 
              alt={`Image ${media.id}`}
              className="object-cover w-full h-40 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onPreview}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <button 
            onClick={onPreview}
            className="flex items-center justify-center w-full px-3 py-2 mt-2 space-x-2 text-sm text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Full Size</span>
          </button>
        </div>
      )}

      {media.media_type === 'video' && (
        <div className="w-full h-48 mb-3 overflow-hidden bg-black rounded-lg">
          <video 
            src={media.url} 
            className="object-cover w-full h-full"
            controls
            preload="metadata"
          />
        </div>
      )}

      {media.status === 'rejected' && media.rejection_reason && (
        <div className="p-3 text-xs border border-red-200 rounded-lg bg-red-50">
          <p className="font-medium text-red-800">Rejection Reason:</p>
          <p className="text-red-700 mt-1">{media.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};

const TourStopCard = ({ stop, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded-lg border transition-all ${
        isActive
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
            {stop.sequence_no}
          </span>
          <span className="text-sm font-medium truncate">{stop.name}</span>
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
  const [isRefreshingMedia, setIsRefreshingMedia] = useState(false);
  
  // Audio player state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef(null);

  // Memoize the map stops to prevent unnecessary re-renders
  // MOVED BEFORE ANY CONDITIONAL LOGIC
  const mapStops = useMemo(() => {
    if (!tour?.tour_stops) return [];
    
    return tour.tour_stops.map(stop => ({
      id: stop.id,
      sequence_no: stop.sequence_no,
      stop_name: stop.stop_name,
      description: stop.description,
      location: stop.location || { latitude: 0, longitude: 0 },
      // Only include essential data for the map
    }));
  }, [tour?.tour_stops]);

  // Memoize the TourStopsMap component to prevent re-renders when audio state changes
  // MOVED BEFORE ANY CONDITIONAL LOGIC
  const MemoizedTourStopsMap = useMemo(() => {
    return (
      <TourStopsMap
        stops={mapStops}
        selectedStopId={selectedStopId}
        onSelectStop={s => setSelectedStopId(s.id)}
      />
    );
  }, [mapStops, selectedStopId]);

  // Function to refresh media URLs with fresh signed URLs
  const refreshMediaUrls = async (tourData) => {
    try {
      if (!tourData) return tourData;

      console.log('🔄 Refreshing media URLs for tour:', tourData.id);
      
      // Only try to refresh if we have the tour data structure that might need refreshing
      if (tourData.tour_stops && tourData.tour_stops.length > 0) {
        try {
          const mediaResponse = await getTourPackageMedia(tourData.id);
          
          if (mediaResponse.success && mediaResponse.data) {
            const freshMediaData = mediaResponse.data;
            console.log('✅ Got fresh media data:', freshMediaData);
            
            // Update cover image URL if exists
            if (freshMediaData.cover_image && freshMediaData.cover_image.url) {
              tourData.cover_image_url = freshMediaData.cover_image.url;
              if (tourData.cover_image) {
                tourData.cover_image.url = freshMediaData.cover_image.url;
              }
            }

            // Update tour stop media URLs
            if (freshMediaData.tour_stops && tourData.tour_stops) {
              tourData.tour_stops.forEach((stop) => {
                // Find matching fresh stop data
                const freshStop = freshMediaData.tour_stops.find(fs => fs.id === stop.id);
                
                if (freshStop && freshStop.media && stop.media) {
                  // Update URLs for existing media items
                  stop.media.forEach((mediaWrapper) => {
                    const media = mediaWrapper.media || mediaWrapper;
                    const freshMedia = freshStop.media.find(fm => fm.id === media.id);
                    
                    if (freshMedia && freshMedia.url) {
                      media.url = freshMedia.url;
                      console.log(`✅ Updated media ${media.id} URL for stop ${stop.id}`);
                    }
                  });
                }
              });
            }
          }
        } catch (mediaError) {
          console.warn('⚠️ Failed to refresh media URLs, continuing with existing URLs:', mediaError.message);
          // Don't throw error, just log warning and continue with existing URLs
        }
      }

      return tourData;
    } catch (error) {
      console.error('Error refreshing media URLs:', error);
      // Don't throw error, just return original data with potentially stale URLs
      return tourData;
    }
  };

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
        
        // Refresh media URLs to ensure they're accessible
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
  }, [id]);

  // Enhanced audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlayingAudio(null);
      setCurrentTime(0);
    };
    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setPlayingAudio(null);
      toast.error('Failed to play audio');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playingAudio]);

  // Update audio volume and playback rate
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const handlePlayAudio = (mediaId, audioUrl) => {
    if (playingAudio === mediaId) return; // Already playing
    
    if (!audioUrl) {
      toast.error('Audio URL is not available');
      return;
    }
    
    setPlayingAudio(mediaId);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((error) => {
        console.error('Audio play failed:', error);
        toast.error('Failed to play audio. The media file may be inaccessible.');
        setPlayingAudio(null);
      });
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAudio(null);
  };

  const handleSeekAudio = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (newRate) => {
    setPlaybackRate(newRate);
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
    if (!stop?.media) {
      return [];
    }
    
    // Handle the media structure - it might be direct media objects or nested in media property
    const mediaItems = stop.media
      .map(mediaItem => {
        // If media is nested in a media property (tour_stop_media structure)
        if (mediaItem.media) {
          return mediaItem.media;
        }
        // If media is direct
        return mediaItem;
      })
      .filter(m => m && m.media_type === type);
    
    return mediaItems || [];
  };

  // Manual refresh function for media URLs
  const handleRefreshMedia = async () => {
    if (!tour || isRefreshingMedia) return;
    
    setIsRefreshingMedia(true);
    const toastId = toast.loading('Refreshing media URLs...');
    
    try {
      const refreshedTour = await refreshMediaUrls(tour);
      setTour(refreshedTour);
      toast.success('Media URLs refreshed successfully!', { id: toastId });
    } catch (error) {
      console.error('Error refreshing media:', error);
      toast.error(`Failed to refresh media URLs: ${error.message}`, { id: toastId });
    } finally {
      setIsRefreshingMedia(false);
    }
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
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom slider styles */
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        .slider::-webkit-slider-track {
          background: #e5e7eb;
          height: 4px;
          border-radius: 2px;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: #2563eb;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-track {
          background: #e5e7eb;
          height: 4px;
          border-radius: 2px;
          border: none;
        }
        
        .slider::-moz-range-thumb {
          background: #2563eb;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        
        /* Enhanced hover effects */
        .media-section-header:hover {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
        }
        
        /* Smooth transitions */
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Glass morphism effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Header section - Redesigned layout */}
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            {/* Top row: Back button + Action buttons */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </button>
              
              {tour.status === 'pending_approval' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleApproveTour}
                    disabled={isApproving || isRejecting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isApproving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {isApproving ? 'Approving...' : 'Approve Tour'}
                  </button>
                  <button
                    onClick={handleRejectTour}
                    disabled={isApproving || isRejecting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Tour
                  </button>
                </div>
              )}
            </div>

            {/* Main content row */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Left: Tour image */}
              <div className="flex-shrink-0">
                {tour.cover_image_url ? (
                  <div className="relative w-full h-48 overflow-hidden shadow-lg lg:w-64 lg:h-40 rounded-xl">
                    <img
                      src={tour.cover_image_url}
                      alt="Tour Cover"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 bg-gray-100 border-2 border-gray-200 border-dashed lg:w-64 lg:h-40 rounded-xl">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Center: Tour details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 break-words leading-tight">{tour.title}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={tour.status} />
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">Tour ID: {tour.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-base text-gray-600 leading-relaxed break-words">{tour.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="text-lg font-bold text-green-600">${tour.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {tour.tour_stops?.length || 0} stops
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Guide info */}
              <div className="flex-shrink-0 lg:w-72">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    {tour.guide?.user?.avatar_url ? (
                      <img
                        src={tour.guide.user.avatar_url}
                        alt={tour.guide.user.name}
                        className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {tour.guide?.user?.name || 'Unknown Guide'}
                      </h3>
                      <p className="text-xs text-blue-600 font-medium">Tour Guide</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    {tour.guide?.years_of_experience && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium text-gray-900">{tour.guide.years_of_experience} years</span>
                      </div>
                    )}
                    {tour.guide?.user?.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-gray-900 truncate">{tour.guide.user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(tour.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection reason if rejected */}
            {tour.status === 'rejected' && tour.rejection_reason && (
              <div className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Rejection Reason</h3>
                    <p className="text-sm text-red-700 leading-relaxed">{tour.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)]">
          {/* Left sidebar - Tour stops (narrower) */}
          <div className="overflow-y-auto bg-white border-r border-gray-200 lg:w-64 no-scrollbar">
            <div className="sticky top-0 z-10 p-3 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Tour Stops ({tour.tour_stops?.length || 0})</h2>
                <button
                  onClick={handleRefreshMedia}
                  disabled={isRefreshingMedia}
                  className="flex items-center px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh media URLs"
                >
                  {isRefreshingMedia ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  <span className="ml-1">{isRefreshingMedia ? 'Refreshing...' : 'Refresh Media'}</span>
                </button>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {tour.tour_stops?.map((stop) => {
                const allMedia = stop.media?.map(mediaItem => mediaItem.media || mediaItem) || [];
                return (
                  <TourStopCard
                    key={stop.id}
                    stop={{
                      id: stop.id,
                      sequence_no: stop.sequence_no,
                      name: stop.stop_name,
                      description: stop.description || '',
                      audioClips: allMedia.filter(m => m?.media_type === 'audio'),
                      images: allMedia.filter(m => m?.media_type === 'image'),
                      videos: allMedia.filter(m => m?.media_type === 'video'),
                      allMedia: allMedia
                    }}
                    isActive={selectedStopId === stop.id}
                    onClick={() => setSelectedStopId(stop.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Middle content - Media cards */}
          {selectedStop && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white border-r border-gray-200 no-scrollbar">
              <div className="p-6">
                {/* Stop Header */}
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3 space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedStop.stop_name}</h2>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                        Stop #{selectedStop.sequence_no}
                      </span>
                    </div>
                  </div>
                  {selectedStop.description && (
                    <p className="text-gray-600 leading-relaxed">{selectedStop.description}</p>
                  )}
                </div>

                <div className="mb-8">
                  <button 
                    onClick={() => toggleSection('audio')}
                    className="flex items-center w-full p-3 mb-4 text-base font-semibold text-gray-900 rounded-xl media-section-header transition-smooth group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Headphones className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="flex-1 text-left">Audio Narration ({getMediaByType(selectedStop.id, 'audio').length})</span>
                    <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      {expandedSections.audio ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections.audio && (
                    getMediaByType(selectedStop.id, 'audio').length > 0 ? (
                      <div className="space-y-4">
                        {getMediaByType(selectedStop.id, 'audio').map((audio) => (
                          <MediaCard
                            key={audio.id}
                            media={audio}
                            onPlay={() => handlePlayAudio(audio.id, audio.url)}
                            onPause={handlePauseAudio}
                            onSeek={handleSeekAudio}
                            isPlaying={playingAudio === audio.id}
                            currentTime={playingAudio === audio.id ? currentTime : 0}
                            duration={playingAudio === audio.id ? duration : audio.duration_seconds || 0}
                            volume={volume}
                            onVolumeChange={handleVolumeChange}
                            playbackRate={playbackRate}
                            onPlaybackRateChange={handlePlaybackRateChange}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-center text-gray-500 rounded-xl bg-gray-50 border border-gray-200">
                        <Headphones className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No audio clips available for this stop</p>
                      </div>
                    )
                  )}
                </div>

                <div className="mb-8">
                  <button 
                    onClick={() => toggleSection('images')}
                    className="flex items-center w-full p-3 mb-4 text-base font-semibold text-gray-900 rounded-xl media-section-header transition-smooth group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="flex-1 text-left">Images ({getMediaByType(selectedStop.id, 'image').length})</span>
                    <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      {expandedSections.images ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections.images && (
                    getMediaByType(selectedStop.id, 'image').length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getMediaByType(selectedStop.id, 'image').map((image, index) => (
                          <div
                            key={image.id}
                            className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                              index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                            }`}
                            onClick={() => {
                              setSelectedImage(image.url);
                              setShowImageModal(true);
                            }}
                          >
                            {/* Image Container */}
                            <div className={`relative overflow-hidden ${
                              index === 0 ? 'h-64 md:h-72 lg:h-80' : 'h-48 md:h-56'
                            }`}>
                              <img 
                                src={image.url} 
                                alt={`Stop image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Hover Icons */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="flex items-center space-x-3">
                                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                                    <Eye className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                                    <Maximize2 className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              
                              {/* Status Badge in Corner */}
                              <div className="absolute top-3 right-3">
                                <StatusBadge status={image.status || 'pending'} />
                              </div>
                              
                              {/* Featured Badge */}
                              {index === 0 && (
                                <div className="absolute top-3 left-3">
                                  <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                                    Featured
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Image Info */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    Image #{image.id}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  #{index + 1}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-3">
                                  {image.format && (
                                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                                      {image.format.toUpperCase()}
                                    </span>
                                  )}
                                  {image.file_size && (
                                    <span>
                                      {(image.file_size / (1024*1024)).toFixed(1)}MB
                                    </span>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(image.url);
                                    setShowImageModal(true);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                              
                              {/* Rejection Reason */}
                              {image.status === 'rejected' && image.rejection_reason && (
                                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                                  <div className="flex items-start space-x-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                                      <p className="text-xs text-red-700 leading-relaxed">{image.rejection_reason}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                        <div className="relative p-12 text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">No Images Available</h3>
                          <p className="text-gray-600 mb-4 max-w-md mx-auto leading-relaxed">
                            This tour stop doesn't have any images yet. Images will appear here once they're uploaded and processed.
                          </p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Tour Stop #{selectedStop.sequence_no}</span>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Waiting for content</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mb-8">
                  <button 
                    onClick={() => toggleSection('videos')}
                    className="flex items-center w-full p-3 mb-4 text-base font-semibold text-gray-900 rounded-xl media-section-header transition-smooth group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Video className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="flex-1 text-left">Videos ({getMediaByType(selectedStop.id, 'video').length})</span>
                    <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      {expandedSections.videos ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections.videos && (
                    getMediaByType(selectedStop.id, 'video').length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {getMediaByType(selectedStop.id, 'video').map((video) => (
                          <MediaCard
                            key={video.id}
                            media={video}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-center text-gray-500 rounded-xl bg-gray-50 border border-gray-200">
                        <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No videos available for this stop</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right sidebar - Map (larger) */}
          <div className="hidden bg-gray-100 border-l border-gray-200 lg:w-1/2 xl:w-2/5 lg:block no-scrollbar">
            <div className="sticky top-0 z-10 p-3 bg-white border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tour Route Map</h2>
              {selectedStop && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedStop.stop_name} - Stop #{selectedStop.sequence_no}
                </p>
              )}
            </div>
            <div className="relative h-full" style={{ minHeight: 'calc(100vh - 230px)' }}>
              {MemoizedTourStopsMap}
            </div>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          preload="metadata"
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
    </>
  );
};

export default TourDetail;