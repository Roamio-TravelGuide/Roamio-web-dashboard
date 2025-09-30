import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL, getMediaUrl } from '../utils/constants';

export const useTourDetail = () => {
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

  // Refresh media URLs with fresh signed URLs
  const refreshMediaUrls = useCallback(async (tourData) => {
    try {
      if (!tourData) return tourData;

      // This would be your actual API call to refresh media URLs
    //   const mediaResponse = await getTourPackageMedia(tourData.id);
      
      // For now, we'll just return the data as is
      // You can implement the actual refresh logic here
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
        
        const response = await axios.get(`${API_URL}/tour-package/${id}`, {
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
          audioRef.current.src = getMediaUrl(audioUrl);
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
        `${API_URL}/tour-packages/${id}`
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

  return {
    // State
    tour,
    isLoading,
    error,
    playingAudio,
    selectedStopId,
    showImageModal,
    selectedImage,
    isDeleting,
    isRefreshingMedia,
    showDeleteModal,
    currentTime,
    duration,
    volume,
    playbackRate,
    
    // Refs
    audioRef,
    
    // Setters
    setSelectedStopId,
    setShowImageModal,
    setSelectedImage,
    setShowDeleteModal,
    
    // Handlers
    handlePlayAudio,
    handlePauseAudio,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleSeek,
    handleEditTour,
    handleDeleteTour,
    handleRefreshMedia,
    getMediaByType,
    
    // Navigation
    navigate
  };
};