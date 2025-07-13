import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, MapPin, Clock, Volume2, Edit, Trash2,
  AlertCircle, Headphones, Image as ImageIcon, ChevronDown, ChevronRight,
  Plus, MoreVertical, Settings, Eye, Loader2, Star, Map, RotateCcw, Info,
  XCircle, VolumeX, Volume1, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { TourStopsMap } from '../../components/tour/TourStopsMap';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
    published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [audioState, setAudioState] = useState({
    playingId: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isLoading: false,
    isSeeking: false
  });
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);


  const mapStops = useMemo(() => {
    if (!tour?.tour_stops) return [];
    
    return tour.tour_stops.map(stop => ({
      id: stop.id,
      sequence_no: stop.sequence_no,
      stop_name: stop.stop_name,
      description: stop.description,
      location: stop.location || { lat: 0, lng: 0 },
    }));
  }, [tour?.tour_stops]);

  const MemoizedTourStopsMap = useMemo(() => (
    <TourStopsMap
      stops={mapStops}
      selectedStopId={selectedStopId}
      onSelectStop={stop => setSelectedStopId(stop.id)}
    />
  ), [mapStops, selectedStopId]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`);
        
        if (!response.data?.success || !response.data?.data) {
          throw new Error('Invalid tour data received');
        }

        const tourData = response.data.data;
        setTour(tourData);
        
        if (tourData.tour_stops?.length > 0) {
          setSelectedStopId(tourData.tour_stops[0].id);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        setError(error.response?.data?.message || 'Failed to load tour details');
        toast.error('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setAudioState(prev => ({ ...prev, currentTime: audio.currentTime }));
    const updateDuration = () => setAudioState(prev => ({ ...prev, duration: audio.duration }));
    const handleEnded = () => setAudioState(prev => ({ ...prev, playingId: null, currentTime: 0 }));
    const handleError = () => {
      toast.error('Failed to play audio');
      setAudioState(prev => ({ ...prev, playingId: null, isLoading: false }));
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioState.isSeeking]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.volume;
      audioRef.current.playbackRate = audioState.playbackRate;
    }
  }, [audioState.volume, audioState.playbackRate]);

  const handlePlayAudio = async (mediaId, audioUrl) => {
    try {
      if (audioState.playingId === mediaId) {
        // Pause if already playing
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, playingId: null }));
      } else {
        // Play new audio
        setAudioState(prev => ({ ...prev, isLoading: true, playingId: mediaId }));
        
        if (audioRef.current.src !== audioUrl) {
          audioRef.current.src = audioUrl;
        }
        
        await audioRef.current.play();
        setAudioState(prev => ({ 
          ...prev, 
          isLoading: false,
          currentTime: 0 // Reset time when new audio starts
        }));
      }
    } catch (error) {
      console.error('Audio play failed:', error);
      toast.error('Failed to play audio');
      setAudioState(prev => ({ ...prev, playingId: null, isLoading: false }));
    }
  };

  const handleSeekStart = () => {
    setAudioState(prev => ({ ...prev, isSeeking: true }));
  };

  const handleSeekMove = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickPosition / rect.width;
    const newTime = percentage * audioState.duration;
    
    setAudioState(prev => ({ ...prev, currentTime: newTime }));
  };

  const handleSeekEnd = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickPosition / rect.width;
    const newTime = percentage * audioState.duration;
    
    audioRef.current.currentTime = newTime;
    setAudioState(prev => ({ 
      ...prev, 
      currentTime: newTime,
      isSeeking: false 
    }));
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * audioState.duration;
    
    audioRef.current.currentTime = newTime;
    setAudioState(prev => ({ ...prev, currentTime: newTime }));
  };

  const handleVolumeChange = (newVolume) => {
    setAudioState(prev => ({ ...prev, volume: newVolume }));
  };

  const handlePlaybackRateChange = (newRate) => {
    setAudioState(prev => ({ ...prev, playbackRate: newRate }));
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDeleteTour = async () => {
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
  };

  const getMediaByType = (stopId, type) => {
    if (!tour?.tour_stops) return [];
    const stop = tour.tour_stops.find(s => s.id === stopId);
    return stop?.media
      .filter(m => m.media?.media_type === type)
      .map(m => m.media) || [];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0 seconds';
    
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecs = remainingSeconds % 60;

    const parts = [];
    
    if (hours > 0) {
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }
    
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
    
    if (remainingSecs > 0 || parts.length === 0) {
      parts.push(`${remainingSecs} second${remainingSecs !== 1 ? 's' : ''}`);
    }

    return parts.join(' ');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleRefreshMedia = async () => {
    if (!tour || isRefreshingMedia) return;
    
    setIsRefreshingMedia(true);
    const toastId = toast.loading('Refreshing media URLs...');
    
    try {
      // Implement your refresh logic here
      toast.success('Media URLs refreshed successfully!', { id: toastId });
    } catch (error) {
      console.error('Error refreshing media:', error);
      toast.error('Failed to refresh media URLs', { id: toastId });
    } finally {
      setIsRefreshingMedia(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-6 py-8 mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 text-gray-700 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Tours</span>
          </button>
          <div className="p-4 border border-red-100 rounded-lg bg-red-50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Error loading tour</h3>
                <p className="mt-1 text-sm text-red-600">{error || 'Tour not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedStop = tour.tour_stops?.find(stop => stop.id === selectedStopId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cover image */}
      <div className="relative overflow-hidden bg-gray-800 h-80">
        <img 
          src={tour.cover_image?.url} 
          alt={tour.title}
          className="absolute inset-0 object-cover w-full h-full"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
        
        <div className="container relative flex flex-col justify-end h-full px-6 pb-8 mx-auto">
          <div className="flex items-start justify-between">
            <div className="max-w-3xl">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center mb-6 text-white transition-colors hover:text-gray-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Tours</span>
              </button>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <StatusBadge status={tour.status} />
                
                {tour.average_rating && (
                  <div className="flex items-center px-3 py-1 text-white rounded-full bg-white/10 backdrop-blur-sm">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>{tour.average_rating.toFixed(1)}</span>
                  </div>
                )}
                
                <div className="flex items-center px-3 py-1 text-white rounded-full bg-white/10 backdrop-blur-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDuration(tour.duration_minutes)}</span>
                </div>
                
                {tour.price > 0 && (
                  <div className="flex items-center px-3 py-1 text-white rounded-full bg-white/10 backdrop-blur-sm">
                    <span>{formatPrice(tour.price)}</span>
                  </div>
                )}
              </div>
              
              <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">{tour.title}</h1>
              <p className="text-lg text-gray-200 line-clamp-3">{tour.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container px-4 py-8 mx-auto sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left sidebar - Tour stops */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Tour Stops
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {tour.tour_stops?.length || 0}
                  </span>
                </h2>
              </div>
              
              {tour.tour_stops?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {tour.tour_stops.map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => setSelectedStopId(stop.id)}
                      className={`w-full text-left p-4 transition-colors duration-150 ${
                        selectedStopId === stop.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedStopId === stop.id 
                            ? 'bg-blue-100 text-blue-600 font-medium' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {stop.sequence_no}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{stop.stop_name}</h3>
                          {stop.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{stop.description}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Headphones className="w-3 h-3 mr-1.5 text-gray-400" />
                              {stop.media?.filter(m => m.media_type === 'audio').length || 0}
                            </span>
                            <span className="flex items-center">
                              <ImageIcon className="w-3 h-3 mr-1.5 text-gray-400" />
                              {stop.media?.filter(m => m.media_type === 'image').length || 0}
                            </span>
                          </div>
                        </div>
                        {selectedStopId === stop.id && (
                          <ChevronRight className="w-5 h-5 ml-2 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-gray-400 bg-gray-100 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-gray-500">No stops added</h4>
                </div>
              )}
              
              <div className="p-4 border-t border-gray-200">
                <Link
                  to={`/guide/tours/${id}/stops/new`}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Stop
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content - Selected stop details */}
          <div className="flex-1">
            {selectedStop ? (
              <div className="overflow-hidden bg-white rounded-lg shadow">
                {/* Stop header */}
                <div className="px-5 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="mr-2 text-sm font-medium text-gray-500">Stop {selectedStop.sequence_no}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedStop.stop_name}
                      </h2>
                      {selectedStop.description && (
                        <p className="mt-2 text-gray-600">{selectedStop.description}</p>
                      )}
                    </div>
                    <div className="flex ml-4 space-x-2">
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/edit`}
                        className="p-2 text-gray-500 transition-colors rounded-md hover:text-blue-600 hover:bg-blue-50"
                        title="Edit Stop"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        className="p-2 text-gray-500 transition-colors rounded-md hover:text-red-600 hover:bg-red-50"
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
                        className="flex items-center text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600"
                      >
                        <Headphones className="w-5 h-5 mr-2 text-blue-600" />
                        <span>Audio Narration</span>
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({getMediaByType(selectedStop.id, 'audio').length})
                        </span>
                        {expandedSections.audio ? (
                          <ChevronDown className="w-5 h-5 ml-2 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                        )}
                      </button>
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=audio`}
                        className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Audio
                      </Link>
                    </div>
                    
                    {expandedSections.audio && (
                      getMediaByType(selectedStop.id, 'audio').length > 0 ? (
                        <div className="space-y-3">
                          {getMediaByType(selectedStop.id, 'audio').map((audio) => (
                            <div key={audio.id} className="p-4 rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 text-blue-600 bg-blue-100 rounded-full">
                                    <Volume2 className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium">Audio #{audio.id}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-gray-500">
                                    {formatTime(audio.duration_seconds)}
                                  </span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Progress bar */}
                              <div className="mb-2 cursor-pointer" onClick={handleSeek}>
                                <div className="relative w-full h-1 mb-1 bg-gray-200 rounded-full">
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                                    style={{ 
                                      width: `${audioState.playingId === audio.id ? 
                                        (audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0) 
                                        : 0}%` 
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>
                                    {audioState.playingId === audio.id ? 
                                      formatTime(audioState.currentTime) : '0:00'}
                                  </span>
                                  <span>
                                    {formatTime(audio.duration_seconds)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {/* Play/Pause button */}
                                <button
                                  onClick={() => handlePlayAudio(audio.id, audio.url)}
                                  disabled={audioState.isLoading && audioState.playingId === audio.id}
                                  className={`flex items-center justify-center w-full px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    audioState.playingId === audio.id
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                                  }`}
                                >
                                  {audioState.isLoading && audioState.playingId === audio.id ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : audioState.playingId === audio.id ? (
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
                                
                                {/* Volume control */}
                                <div className="flex items-center ml-3">
                                  <button 
                                    onClick={() => handleVolumeChange(audioState.volume > 0 ? 0 : 1)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                  >
                                    {audioState.volume === 0 ? (
                                      <VolumeX className="w-4 h-4" />
                                    ) : audioState.volume < 0.5 ? (
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
                                    value={audioState.volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                                
                                {/* Playback speed */}
                                <div className="ml-3">
                                  <select
                                    value={audioState.playbackRate}
                                    onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                                    className="px-2 py-1 text-xs bg-white border border-gray-300 rounded"
                                  >
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                      <option key={speed} value={speed}>{speed}x</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-lg bg-gray-50">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-gray-400 bg-gray-200 rounded-full">
                            <Headphones className="w-5 h-5" />
                          </div>
                          <h4 className="mb-1 font-medium text-gray-500">No audio narration</h4>
                          <p className="mb-4 text-sm text-gray-400">Add audio to guide visitors through this stop</p>
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=audio`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Audio
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Images section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => toggleSection('images')}
                        className="flex items-center text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600"
                      >
                        <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                        <span>Images</span>
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({getMediaByType(selectedStop.id, 'image').length})
                        </span>
                        {expandedSections.images ? (
                          <ChevronDown className="w-5 h-5 ml-2 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                        )}
                      </button>
                      <Link
                        to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=image`}
                        className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Image
                      </Link>
                    </div>
                    
                    {expandedSections.images && (
                      getMediaByType(selectedStop.id, 'image').length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {getMediaByType(selectedStop.id, 'image').map((image) => (
                            <div key={image.id} className="relative group aspect-square">
                              <div className="absolute inset-0 overflow-hidden rounded-lg">
                                <img
                                  src={image.url}
                                  alt={`Stop ${selectedStop.sequence_no} - ${selectedStop.stop_name}`}
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                  onClick={() => {
                                    setSelectedImage(image.url);
                                    setShowImageModal(true);
                                  }}
                                />
                                <div className="absolute inset-0 flex items-end p-3 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100">
                                  <div className="flex space-x-2">
                                    <button 
                                      className="p-2 text-gray-800 transition-colors rounded-full bg-white/90 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(image.url);
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-800 transition-colors rounded-full bg-white/90 hover:bg-white">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-800 transition-colors rounded-full bg-white/90 hover:bg-white">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-lg bg-gray-50">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-gray-400 bg-gray-200 rounded-full">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <h4 className="mb-1 font-medium text-gray-500">No images</h4>
                          <p className="mb-4 text-sm text-gray-400">Add images to showcase this location</p>
                          <Link
                            to={`/guide/tours/${id}/stops/${selectedStop.id}/media/upload?type=image`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Image
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-lg shadow">
                <div className="flex items-center justify-center mx-auto mb-4 text-gray-400 bg-gray-100 rounded-full w-14 h-14">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">No stop selected</h3>
                <p className="mb-6 text-gray-500">Select a stop from the list to view details</p>
                <Link
                  to={`/guide/tours/${id}/stops/new`}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Stop
                </Link>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Location and actions */}
          <div className="space-y-6 lg:w-80 xl:w-96">
            {/* Location card */}
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <Map className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Tour Route Map</span>
                  </h3>
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
              <div className="p-4 border-t border-gray-200">
                <button className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setAudioState(prev => ({ ...prev, playingId: null, currentTime: 0 }))}
        onError={() => {
          console.error('Audio playback error');
          setAudioState(prev => ({ ...prev, playingId: null, isLoading: false }));
          toast.error('Failed to play audio');
        }}
      />

      {/* Image preview modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -right-2 -top-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex flex-col items-center">
              <img 
                src={selectedImage} 
                alt="Full size preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl"
              />
              <div className="flex mt-4 space-x-3">
                <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;