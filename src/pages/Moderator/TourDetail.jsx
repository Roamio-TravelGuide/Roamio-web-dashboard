  import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import toast from 'react-hot-toast';
  import { 
    ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X,  
    Check, AlertCircle, Headphones, Image as ImageIcon, User,
    CheckCircle, XCircle, Eye, Loader2, ChevronDown, ChevronRight,
    SkipForward, SkipBack, VolumeX, Volume1, RotateCcw, Settings,
    Maximize2, ExternalLink, AlertTriangle, ZoomIn, Download
  } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
  import {TourStopsMap} from '../../components/tour/TourStopsMap';
  import axios from 'axios';
  import { getMediaUrl } from '../../utils/constants';

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // StatusBadge component extracted for reusability
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' }
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
  const ImageGallery = React.memo(({ images, onImageClick }) => {
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
          </div>
        ))}
      </div>
    );
  });

  // TourStopCard component with memoization
  const TourStopCard = React.memo(({ stop, isActive, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border transition-all ${
          isActive
            ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-inner'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
    );
  });

  // Modal components with better accessibility
  const TourRejectModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
    const [selectedReasons, setSelectedReasons] = React.useState({
      audio: [],
      image: [],
      other: false
    });
    const [otherReason, setOtherReason] = React.useState('');

    const audioReasons = [
      'Background noise',
      'Incomplete playback',
      'Language used is not clear and not relevant',
      'Offensive or unrelated content'
    ];

    const imageReasons = [
      'Image is stretched or distorted',
      'Offensive or irrelevant content',
      'Image does not match the tour stop'
    ];

    React.useEffect(() => {
      if (isOpen) {
        setSelectedReasons({ audio: [], image: [], other: false });
        setOtherReason('');
      }
    }, [isOpen]);

    const handleReasonChange = (category, reasonText, checked) => {
      setSelectedReasons(prev => ({
        ...prev,
        [category]: checked 
          ? [...prev[category], reasonText]
          : prev[category].filter(r => r !== reasonText)
      }));
    };

    const handleOtherChange = (checked) => {
      setSelectedReasons(prev => ({ ...prev, other: checked }));
      if (!checked) {
        setOtherReason('');
      }
    };

    const generateRejectionReason = () => {
      const reasons = [];
      
      if (selectedReasons.audio.length > 0) {
        reasons.push(`Audio issues: ${selectedReasons.audio.join(', ')}`);
      }
      
      if (selectedReasons.image.length > 0) {
        reasons.push(`Image issues: ${selectedReasons.image.join(', ')}`);
      }
      
      if (selectedReasons.other && otherReason.trim()) {
        reasons.push(`Other: ${otherReason.trim()}`);
      }
      
      return reasons.join('. ');
    };

    const handleConfirm = () => {
      const finalReason = generateRejectionReason();
      onConfirm(finalReason);
    };

    const isValid = selectedReasons.audio.length > 0;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Tour Package</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={isSubmitting}
                aria-label="Close reject modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mb-6 text-gray-600">
              Please select the reason(s) for rejecting this tour package. <strong>At least one audio issue must be selected.</strong> Image issues and other reasons are optional.
            </p>

            <div className="space-y-6">
              {/* Audio Issues Section */}
              <div>
                <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-900">
                  <Headphones className="w-4 h-4 mr-2 text-blue-600" />
                  Audio Issues (Required - Select at least one)
                </h4>
                <div className="space-y-2">
                  {audioReasons.map((audioReason) => (
                    <label key={audioReason} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedReasons.audio.includes(audioReason)}
                        onChange={(e) => handleReasonChange('audio', audioReason, e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">{audioReason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Issues Section */}
              <div>
                <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-900">
                  <ImageIcon className="w-4 h-4 mr-2 text-green-600" />
                  Image Issues (Optional)
                </h4>
                <div className="space-y-2">
                  {imageReasons.map((imageReason) => (
                    <label key={imageReason} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedReasons.image.includes(imageReason)}
                        onChange={(e) => handleReasonChange('image', imageReason, e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">{imageReason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Reason Section */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReasons.other}
                    onChange={(e) => handleOtherChange(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-semibold text-gray-900">Other reason</span>
                </label>
                
                {selectedReasons.other && (
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Please specify the other reason for rejection..."
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    disabled={isSubmitting}
                    aria-label="Other rejection reason"
                  />
                )}
              </div>
            </div>

            {/* Validation Message */}
            {!isValid && (
              <div className="p-3 mt-4 border rounded-lg border-amber-200 bg-amber-50">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    At least one audio issue must be selected to reject a tour.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isValid || isSubmitting}
                className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isValid && !isSubmitting
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-300 cursor-not-allowed'
                }`}
                aria-label="Confirm rejection"
              >
                {isSubmitting && <LoadingSpinner size={16} className="text-white" />}
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
        <div className="relative max-w-4xl max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute right-0 text-white -top-10 hover:text-gray-300 focus:outline-none"
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
    const [expandedSections, setExpandedSections] = useState({
      audio: true,
      images: true
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

  // Refresh media URLs (map relative URLs returned by the API to full API URLs)
    const refreshMediaUrls = useCallback(async (tourData) => {
      try {
        if (!tourData) return tourData;

        // If the API already returned media entries, convert any relative urls
        if (tourData.cover_image && tourData.cover_image.url) {
          tourData.cover_image_url = getMediaUrl(tourData.cover_image.url);
          tourData.cover_image.url = getMediaUrl(tourData.cover_image.url);
        }

        if (tourData.tour_stops && Array.isArray(tourData.tour_stops)) {
          tourData.tour_stops.forEach((stop) => {
            if (!stop.media) return;
            // stop.media is an array of { stop_id, media_id, media: { ... } }
            stop.media = stop.media.map((m) => {
              const mediaObj = m.media || m;
              return {
                ...m,
                media: {
                  ...mediaObj,
                  url: getMediaUrl(mediaObj?.url),
                },
              };
            });
          });
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
          
          const response = await axios.get(`${API_BASE_URL}/tour-package/${id}`, { timeout: 10000 });
          if (!response.data?.success || !response.data?.data) {
            throw new Error('Invalid tour data received');
          }

          const data = response.data.data;

          // Fetch explicit media listing from the backend (cover + stops media)
          try {
            const mediaResp = await axios.get(`${API_BASE_URL}/tour-package/${id}/media`);
            if (mediaResp.data?.success && mediaResp.data?.data) {
              // merge the media payload into the tour data for consistent mapping
              data.cover_image = mediaResp.data.data.cover_image || data.cover_image || null;
              // Replace stop media arrays with the authoritative media list
              if (Array.isArray(data.tour_stops)) {
                data.tour_stops = data.tour_stops.map((stop) => {
                  const mediaInfo = (mediaResp.data.data.tour_stops || []).find(s => s.id === stop.id);
                  return {
                    ...stop,
                    media: mediaInfo ? (mediaInfo.media || []) : (stop.media || [])
                  };
                });
              }
            }
          } catch (err) {
            console.debug('Failed to fetch package media list, falling back to inline media', err?.message || err);
          }

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
      console.debug('handlePlayAudio called', { mediaId, audioUrl });
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

    const handleApproveTour = useCallback(async () => {
      if (!tour || !id || isApproving) return;
      
      setIsApproving(true);
      const toastId = toast.loading('Approving tour...');
      
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/tour-package/${id}/status`,
          { status: 'published' },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
          }
        );

        if (response.status === 200 && response.data?.success) {
          setTour(prev => prev ? { ...prev, status: 'published', rejection_reason: undefined } : null);
          setError(null);
          
          toast.success('Tour approved successfully! The tour is now published and available to users.', { 
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
    }, [tour, id, isApproving]);

    const handleRejectTour = useCallback(() => {
      setShowTourRejectModal(true);
      setTourRejectReason('');
    }, []);

    const confirmRejectTour = useCallback(async (rejectionReason) => {
      if (!tour || !id || !rejectionReason?.trim() || isRejecting) return;

      setIsRejecting(true);
      const toastId = toast.loading('Rejecting tour...');

      try {
        const response = await axios.patch(
          `${API_BASE_URL}/tour-package/${id}/status`,
          {
            status: 'rejected',
            rejection_reason: rejectionReason
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
          }
        );

        if (response.status === 200 && response.data?.success) {
          setTour(prev => prev ? { 
            ...prev, 
            status: 'rejected', 
            rejection_reason: rejectionReason 
          } : null);
          
          setShowTourRejectModal(false);
          setTourRejectReason('');
          setError(null);
          
          toast.success('Tour rejected successfully. The guide has been notified with your feedback.', { 
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
    }, [tour, id, isRejecting]);

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
            <LoadingSpinner size={32} className="text-indigo-600 mx-auto mb-4" />
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
              
              {tour.status === 'pending_approval' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApproveTour}
                    disabled={isApproving || isRejecting}
                    className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isApproving ? (
                      <LoadingSpinner size={16} className="text-indigo-600 mr-1.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                    )}
                    {isApproving ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={handleRejectTour}
                    disabled={isApproving || isRejecting}
                    className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
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

              {/* Guide Info */}
              <div className="lg:col-span-1">
                <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
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
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
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

            {/* Rejection Reason */}
            {tour.status === 'rejected' && tour.rejection_reason && (
              <div className="p-3 mt-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-red-800">Tour Rejected</h3>
                    <p className="text-sm text-red-700">{tour.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-2 py-6 mx-auto max-w-7xl sm:px-3 lg:px-4">
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
                        <LoadingSpinner size={16} className="text-indigo-600" />
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

        {/* Modals */}
        <TourRejectModal
          isOpen={showTourRejectModal}
          onClose={() => {
            if (!isRejecting) {
              setShowTourRejectModal(false);
              setTourRejectReason('');
            }
          }}
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