import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, X, Search, Filter, ChevronDown, Check } from 'lucide-react';
import axios from 'axios';

// Define types
type TourStatus = 'pending_approval' | 'published' | 'rejected';
type StatusTab = 'PENDING' | 'PUBLISHED' | 'REJECTED';
type City = 'galle' | 'matara' | 'colombo' | 'jaffna' | 'kandy' | 'rhoafa' | 'food';

interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  location: string;
  guide: {
    id: number;
    name: string;
    avatar_url: string;
  };
  price: number;
  status: TourStatus;
  image_url: string;
  created_at: string;
  tags: string[];
  rejection_reason?: string;
}

interface CityFilter {
  [key: string]: boolean;
}

const API_BASE_URL = 'http://localhost:3001/api/v1';

const ModeratorDashboard = () => {
  
  // State management
  const [selectedTab, setSelectedTab] = useState<StatusTab>('PENDING');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState<CityFilter>({
    galle: false,
    matara: false,
    colombo: false,
    jaffna: false,
    kandy: false,
    rhoafa: false,
    food: false
  });
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ pending: number; published: number; rejected: number }>({ 
    pending: 0, 
    published: 0, 
    rejected: 0 
  });

  // Convert API response to component format
  const convertApiResponseToTour = (apiTour: any): TourPackage => {
    return {
      id: apiTour.id,
      title: apiTour.title,
      description: apiTour.description || '',
      duration_minutes: apiTour.duration_minutes,
      location: apiTour.title, // Using title as location for now since location isn't in API response
      guide: {
        id: apiTour.guide?.user?.id || apiTour.guide_id,
        name: apiTour.guide?.user?.name || 'Unknown Guide',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' // Default avatar
      },
      price: apiTour.price,
      status: apiTour.status,
      image_url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', // Default image
      created_at: apiTour.created_at,
      tags: [], // Default empty tags
      rejection_reason: apiTour.rejection_reason
    };
  };

  // Fetch tour packages
  const fetchTourPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Define the params type
      type RequestParams = {
        status: string;
        search: string;
        page: number;
        limit: number;
        location?: string;
        dateFrom?: string;
        dateTo?: string;
      };

      // Initialize params with required properties
      const params: RequestParams = {
        status: selectedTab.toLowerCase().replace('pending', 'pending_approval'),
        search: searchQuery,
        page: 1,
        limit: 10
      };

      // Add optional properties conditionally
      const selectedCitiesList = Object.keys(selectedCities)
        .filter(city => selectedCities[city]);
      if (selectedCitiesList.length > 0) {
        params.location = selectedCitiesList.join(',');
      }

      if (dateFrom) {
        params.dateFrom = dateFrom;
      }

      if (dateTo) {
        params.dateTo = dateTo;
      }

      const response = await axios.get(`${API_BASE_URL}/tour-packages`, {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const apiTours = response.data.data?.packages || [];
      const convertedTours = apiTours.map(convertApiResponseToTour);
      setTours(convertedTours);
    } catch (err) {
      setError('Failed to load tours. Please try again.');
      console.error('Error fetching tours:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tour-packages/statistics`);
      // Updated to match backend response
      setStats({
        pending: response.data.data?.pending || 0,
        published: response.data.data?.published || 0,
        rejected: response.data.data?.rejected || 0
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTourPackages();
    fetchStatistics();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTourPackages();
  }, [selectedTab, searchQuery, selectedCities, dateFrom, dateTo]);

  // Handle tour approval
  const handleApprove = async (tourId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await axios.patch(`${API_BASE_URL}/tour-packages/${tourId}/status`, {
        status: 'published'
      });
      fetchTourPackages();
      fetchStatistics();
    } catch (err) {
      setError('Failed to approve tour. Please try again.');
      console.error('Error approving tour:', err);
    }
  };

  // Handle tour rejection
  const handleReject = (tour: TourPackage, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTour(tour);
    setShowRejectModal(true);
  };

  // Confirm rejection
  const confirmReject = async () => {
    if (!selectedTour || !rejectReason.trim()) return;
    
    try {
      await axios.patch(`${API_BASE_URL}/tour-packages/${selectedTour.id}/status`, {
        status: 'rejected',
        rejection_reason: rejectReason
      });
      
      fetchTourPackages();
      // fetchStatistics();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedTour(null);
    } catch (err) {
      setError('Failed to reject tour. Please try again.');
      console.error('Error rejecting tour:', err);
    }
  };

  // Toggle city filter
  const handleCityToggle = (city: City) => {
    setSelectedCities(prev => ({
      ...prev,
      [city]: !prev[city]
    }));
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 mx-auto py-8 max-w-[90%] sm:px-6 lg:px-8">
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-72">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} Found
                </p>
              </div>

              {/* Status Tabs */}
              <div className="mb-6 space-y-2">
                {[
                  { status: 'PENDING', color: 'yellow', count: stats.pending },
                  { status: 'PUBLISHED', color: 'green', count: stats.published },
                  { status: 'REJECTED', color: 'red', count: stats.rejected }
                ].map((tab) => (
                  <button
                    key={tab.status}
                    onClick={() => setSelectedTab(tab.status as StatusTab)}
                    className={`w-full flex justify-between items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      selectedTab === tab.status 
                        ? `bg-${tab.color}-50 text-${tab.color}-700 border-l-4 border-${tab.color}-500`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{tab.status}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedTab === tab.status 
                        ? `bg-${tab.color}-100 text-${tab.color}-700`
                        : 'bg-white text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-700 uppercase">Date Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500">From</label>
                    <div className="relative">
                      <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500">To</label>
                    <div className="relative">
                      <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cities Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">Locations</h3>
                  <div className="p-1 bg-gray-100 rounded-md">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedCities).map(([city, checked]) => (
                    <label 
                      key={city}
                      className={`flex items-center space-x-2 text-sm p-2 rounded-md cursor-pointer transition-colors ${
                        checked 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCityToggle(city as City)}
                        className={`w-4 h-4 rounded ${
                          checked ? 'text-blue-600 border-blue-300' : 'text-gray-400 border-gray-300'
                        } focus:ring-blue-500`}
                      />
                      <span className="capitalize">{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Tour Cards */}
                <div className="space-y-6">
                  {tours.length > 0 ? (
                    tours.map((tour) => (
                      <div 
                        key={tour.id}
                        className="overflow-hidden bg-white rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-shrink-0 w-full h-48 md:w-64 md:h-auto">
                            <img 
                              src={tour.image_url} 
                              alt={tour.title} 
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col justify-between mb-4 space-y-3 sm:flex-row sm:space-y-0">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{tour.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {tour.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <img 
                                  src={tour.guide.avatar_url} 
                                  alt={tour.guide.name} 
                                  className="w-10 h-10 rounded-full"
                                  loading="lazy"
                                />
                                <div className="text-right">
                                  <span className="block text-sm font-medium">{tour.guide.name}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tour.status)}`}>
                                    {tour.status.toUpperCase().replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <span>{formatDuration(tour.duration_minutes)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                <span>{tour.location}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500">Posted: {formatDate(tour.created_at)}</span>
                              </div>
                            </div>

                            <p className="mb-4 text-sm text-gray-600 line-clamp-2">{tour.description}</p>

                            {tour.rejection_reason && (
                              <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                                <p className="text-sm text-red-700">
                                  <strong>Rejection Reason:</strong> {tour.rejection_reason}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0 sm:items-center">
                              <div className="text-xl font-bold text-teal-600">${tour.price.toFixed(2)}</div>
                              
                              {tour.status === 'pending_approval' && (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={(e) => handleApprove(tour.id, e)}
                                    className="px-6 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                  >
                                    APPROVE
                                  </button>
                                  <button
                                    onClick={(e) => handleReject(tour, e)}
                                    className="px-6 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  >
                                    REJECT
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white rounded-lg shadow-sm">
                      <div className="max-w-md mx-auto">
                        <Search className="w-12 h-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No tours found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {searchQuery 
                            ? `No tours match your search for "${searchQuery}". Try a different search term.`
                            : 'There are no tours matching your current filters.'}
                        </p>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCities({
                              galle: false,
                              matara: false,
                              colombo: false,
                              jaffna: false,
                              kandy: false,
                              rhoafa: false,
                              food: false
                            });
                            setDateFrom('');
                            setDateTo('');
                          }}
                          className="px-4 py-2 mt-4 text-sm font-medium text-teal-600 rounded-lg bg-teal-50 hover:bg-teal-100"
                        >
                          Reset all filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Tour</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting <span className="font-medium">"{selectedTour.title}"</span>
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
                  setRejectReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
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
    </div>
  );
};

export default ModeratorDashboard;