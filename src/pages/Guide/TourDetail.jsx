import React, { useMemo } from 'react';
import { 
  ArrowLeft, Headphones, ImageIcon, MapPin, 
  ChevronDown, ChevronRight, AlertCircle, Loader2 
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useTourDetail } from '../../hooks/useTourDetail';
import TourDetailLayout from '../../layouts/TourDetailLayout';
import AudioPlayer from '../../components/tour/details/AudioPlayer';
import ImageGallery from '../../components/tour/details/ImageGallery';
import ImagePreviewModal from '../../components/tour/details/ImagePreviewModal';
import ConfirmationModal from '../../components/tour/details/ConfirmationModal';
import { TourStopsMap } from '../../components/tour/TourStopsMap';
import { getMediaUrl } from '../../utils/constants';

const TourDetail = () => {
  const {
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
  } = useTourDetail();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center bg-white border border-gray-100 rounded-lg shadow-xs">
            <LoadingSpinner size={32} className="text-indigo-600 mx-auto mb-4" />
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

  const TourStopsContent = (
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
  );

  return (
    <>
      <TourDetailLayout
        tour={tour}
        selectedStopId={selectedStopId}
        onBack={() => navigate(-1)}
        onEdit={handleEditTour}
        onDelete={() => setShowDeleteModal(true)}
        onRefreshMedia={handleRefreshMedia}
        isRefreshing={isRefreshingMedia}
      >
        {TourStopsContent}
        {MemoizedTourStopsMap}
      </TourDetailLayout>

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
    </>
  );
};

export default TourDetail;