import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, MapPin, Clock, Volume2, X, ExternalLink } from 'lucide-react';

interface AudioClip {
  id: number;
  locationId: number;
  title: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
  audioUrl: string;
  isPlaying?: boolean;
  rejectionReason?: string;
}

interface TourLocation {
  id: number;
  name: string;
  description: string;
  image: string;
  coordinates: [number, number];
  audioClips: AudioClip[];
}

interface TourDetail {
  id: number;
  title: string;
  description: string;
  duration: string;
  guide: string;
  guideAvatar: string;
  price: string;
  locations: TourLocation[];
  mapCenter: [number, number];
}

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAudioClip, setSelectedAudioClip] = useState<AudioClip | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Mock tour data
  const mockTourData: TourDetail = {
    id: 1,
    title: 'A Promenade through Pondicherry: The French Jewel of India',
    description: 'Discover the charming French colonial heritage of Pondicherry through its historic streets, beautiful architecture, and cultural landmarks.',
    duration: '3 hours',
    guide: 'Fabienne Laurent',
    guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=60&h=60&fit=crop&crop=face',
    price: '$45.00',
    mapCenter: [11.9416, 79.8083],
    locations: [
      {
        id: 1,
        name: 'Departure of the tour : Dupleix Statue',
        description: 'Hello, I\'m Fabienne, an Art Historian and a licenced tour Guide in my home country France. After spending the last 20 years abroad, I\'m currently based in Chennai, in south India. I love to underst...',
        image: 'https://images.unsplash.com/photo-1566133264076-7c74b1e3b6f5?w=300&h=200&fit=crop',
        coordinates: [11.9416, 79.8083],
        audioClips: [
          {
            id: 1,
            locationId: 1,
            title: 'Introduction to Dupleix Statue',
            duration: '2:30',
            status: 'pending',
            audioUrl: '/audio/dupleix-intro.mp3'
          },
          {
            id: 2,
            locationId: 1,
            title: 'Historical Context',
            duration: '3:15',
            status: 'approved',
            audioUrl: '/audio/dupleix-history.mp3'
          }
        ]
      },
      {
        id: 2,
        name: 'Schoelcher Monument',
        description: 'Keep going straight. Coming up on your right is another sculpture. You can see the Schoelcher bust, an iconic character in French colonies\' history. The bust sits on a simple white pedestal and...',
        image: 'https://images.unsplash.com/photo-1571935716260-fc369c67ad36?w=300&h=200&fit=crop',
        coordinates: [11.9426, 79.8093],
        audioClips: [
          {
            id: 3,
            locationId: 2,
            title: 'Schoelcher Monument Overview',
            duration: '1:45',
            status: 'rejected',
            audioUrl: '/audio/schoelcher-overview.mp3',
            rejectionReason: 'Audio quality is poor and contains background noise'
          },
          {
            id: 4,
            locationId: 2,
            title: 'Historical Significance',
            duration: '2:20',
            status: 'pending',
            audioUrl: '/audio/schoelcher-history.mp3'
          }
        ]
      },
      {
        id: 3,
        name: 'Former French Law Court',
        description: 'On your left you\'ll see the former French Law Court. This impressive colonial building showcases the architectural heritage of French Pondicherry with its distinctive red roof and white walls.',
        image: 'https://images.unsplash.com/photo-1593436878396-9c2d3b8b4e4d?w=300&h=200&fit=crop',
        coordinates: [11.9436, 79.8103],
        audioClips: [
          {
            id: 5,
            locationId: 3,
            title: 'Law Court Architecture',
            duration: '2:50',
            status: 'approved',
            audioUrl: '/audio/law-court-architecture.mp3'
          },
          {
            id: 6,
            locationId: 3,
            title: 'Colonial Justice System',
            duration: '3:30',
            status: 'pending',
            audioUrl: '/audio/colonial-justice.mp3'
          }
        ]
      }
    ]
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          if (id === '1') {
            setTour(mockTourData);
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handlePlayAudio = (audioId: number) => {
    if (playingAudio === audioId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioId);
    }
  };

  const handleApproveAudio = (audioId: number) => {
    if (!tour) return;
    
    const updatedTour = {
      ...tour,
      locations: tour.locations.map(location => ({
        ...location,
        audioClips: location.audioClips.map(clip =>
          clip.id === audioId ? { ...clip, status: 'approved' as const } : clip
        )
      }))
    };
    
    setTour(updatedTour);
    console.log('Approved audio clip:', audioId);
  };

  const handleRejectAudio = (audioClip: AudioClip) => {
    setSelectedAudioClip(audioClip);
    setShowRejectModal(true);
  };

  const confirmRejectAudio = () => {
    if (!selectedAudioClip || !tour || !rejectReason.trim()) return;
    
    const updatedTour = {
      ...tour,
      locations: tour.locations.map(location => ({
        ...location,
        audioClips: location.audioClips.map(clip =>
          clip.id === selectedAudioClip.id 
            ? { ...clip, status: 'rejected' as const, rejectionReason: rejectReason }
            : clip
        )
      }))
    };
    
    setTour(updatedTour);
    setShowRejectModal(false);
    setSelectedAudioClip(null);
    setRejectReason('');
    
    console.log('Rejected audio clip:', selectedAudioClip.id, 'Reason:', rejectReason);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasRejectedAudio = tour?.locations.some(location => 
    location.audioClips.some(clip => clip.status === 'rejected')
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tour not found</h2>
          <button
            onClick={() => navigate('/moderator/dashboard')}
            className="px-4 py-2 mt-4 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/moderator/dashboard')}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Tour Locations | {tour.title}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Fixed Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Scrollable Tour Locations */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 space-y-6">
            {/* Tour Header */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={tour.guideAvatar}
                  alt={tour.guide}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h1 className="mb-2 text-2xl font-bold text-gray-900">{tour.title}</h1>
                  <div className="flex items-center mb-3 space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Guide: {tour.guide}</span>
                    </div>
                    <div className="text-lg font-bold text-teal-600">{tour.price}</div>
                  </div>
                  <p className="text-sm text-gray-600">{tour.description}</p>
                  {hasRejectedAudio && (
                    <div className="p-2 mt-3 border border-red-200 rounded-md bg-red-50">
                      <p className="text-sm font-medium text-red-800">
                        ⚠️ This tour has rejected audio clips that need attention
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Cards */}
            {tour.locations.map((location) => (
              <div key={location.id} className="overflow-hidden bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-start mb-4 space-x-4">
                    <div className="flex-shrink-0 w-2 h-6 bg-teal-500 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        LOCATION {location.id}
                      </h3>
                      <h4 className="mb-3 text-xl font-bold text-gray-800">
                        {location.name}
                      </h4>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mb-6 md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="object-cover w-full h-48 rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {location.description}
                      </p>
                      <button className="mt-3 text-sm font-medium text-teal-600 hover:text-teal-700">
                        Read More
                      </button>
                    </div>
                  </div>
                  {/* Audio Clips */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Audio Clips</h5>
                    {location.audioClips.map((clip) => (
                      <div
                        key={clip.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handlePlayAudio(clip.id)}
                              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                            >
                              {playingAudio === clip.id ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                              <span className="font-medium">Play Audio</span>
                            </button>
                            <div className="flex items-center text-sm text-gray-600">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              <span>Show Directions</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clip.status)}`}>
                            {clip.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mb-3">
                          <h6 className="font-medium text-gray-900">{clip.title}</h6>
                          <p className="text-sm text-gray-600">Duration: {clip.duration}</p>
                        </div>
                        {clip.status === 'rejected' && clip.rejectionReason && (
                          <div className="p-2 mb-3 border border-red-200 rounded bg-red-50">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong> {clip.rejectionReason}
                            </p>
                          </div>
                        )}
                        {clip.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApproveAudio(clip.id)}
                              className="px-4 py-2 text-sm text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAudio(clip)}
                              className="px-4 py-2 text-sm text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Fixed Map */}
        <div className="flex-shrink-0 w-1/2">
          <div className="h-full p-8">
            <div className="h-full overflow-hidden bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Tour Route</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded">
                      Map
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 rounded hover:bg-gray-100">
                      Satellite
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Map Content */}
              <div className="relative flex items-center justify-center h-[calc(100%-4rem)] bg-gradient-to-br from-blue-50 to-green-50">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-teal-500" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Interactive Map</h4>
                  <p className="max-w-sm text-sm text-gray-600">
                    Tour route with {tour.locations.length} stops would be displayed here using Google Maps or similar mapping service
                  </p>
                </div>
                
                {/* Mock map markers */}
                <div className="absolute inset-0">
                  {tour.locations.map((location, index) => (
                    <div
                      key={location.id}
                      className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-red-500 rounded-full shadow-lg"
                      style={{
                        left: `${20 + index * 25}%`,
                        top: `${30 + index * 15}%`,
                      }}
                    >
                      {location.id}
                    </div>
                  ))}
                  
                  {/* Mock route line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 20% 30% Q 35% 45% 45% 45% T 70% 60%"
                      stroke="#ef4444"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Audio Modal */}
      {showRejectModal && selectedAudioClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Audio Clip</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAudioClip(null);
                  setRejectReason('');
                }}
                className="text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting the audio clip <span className="font-medium">"{selectedAudioClip.title}"</span>
            </p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (required)..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              autoFocus
            />
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAudioClip(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectAudio}
                disabled={!rejectReason.trim()}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  rejectReason.trim() ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TourDetail;