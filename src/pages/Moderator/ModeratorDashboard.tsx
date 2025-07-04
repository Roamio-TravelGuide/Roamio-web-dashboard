import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  X, 
  Search, 
  Filter, 
  ChevronDown, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

interface QuickAction {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
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
  const [showFilters, setShowFilters] = useState(false);
  const [processingTours, setProcessingTours] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);

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
      location: apiTour.title,
      guide: {
        id: apiTour.guide?.user?.id || apiTour.guide_id,
        name: apiTour.guide?.user?.name || 'Unknown Guide',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      price: apiTour.price,
      status: apiTour.status,
      image_url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      created_at: apiTour.created_at,
      tags: [],
      rejection_reason: apiTour.rejection_reason
    };
  };

  // Fetch tour packages
  const fetchTourPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      type RequestParams = {
        status: string;
        search: string;
        page: number;
        limit: number;
        location?: string;
        dateFrom?: string;
        dateTo?: string;
      };

      const params: RequestParams = {
        status: selectedTab.toLowerCase().replace('pending', 'pending_approval'),
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
      };

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
      
      const responseData = response.data.data;
      const apiTours = responseData?.packages || [];
      const convertedTours = apiTours.map(convertApiResponseToTour);
      
      setTours(convertedTours);
      setTotalItems(responseData?.total || 0);
      setTotalPages(Math.ceil((responseData?.total || 0) / itemsPerPage));
      
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
      setStats({
        pending: response.data.data?.pending || 0,
        published: response.data.data?.published || 0,
        rejected: response.data.data?.rejected || 0
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Initial data fetch
  useEffect(() => {
    fetchTourPackages();
    fetchStatistics();
  }, []);

  // Refetch when filters change (reset to page 1)
  useEffect(() => {
    resetToFirstPage();
  }, [selectedTab, searchQuery, selectedCities, dateFrom, dateTo]);

  // Refetch when page changes
  useEffect(() => {
    fetchTourPackages();
  }, [currentPage, selectedTab, searchQuery, selectedCities, dateFrom, dateTo]);

  // Handle tour approval
  const handleApprove = async (tourId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setProcessingTours((prev: Set<number>) => new Set(prev).add(tourId));
    
    try {
      await axios.patch(`${API_BASE_URL}/tour-packages/${tourId}/status`, {
        status: 'published'
      });
      fetchTourPackages();
      fetchStatistics();
    } catch (err) {
      setError('Failed to approve tour. Please try again.');
      console.error('Error approving tour:', err);
    } finally {
      setProcessingTours((prev: Set<number>) => {
        const newSet = new Set(prev);
        newSet.delete(tourId);
        return newSet;
      });
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
    
    setProcessingTours((prev: Set<number>) => new Set(prev).add(selectedTour.id));
    
    try {
      await axios.patch(`${API_BASE_URL}/tour-packages/${selectedTour.id}/status`, {
        status: 'rejected',
        rejection_reason: rejectReason
      });
      
      fetchTourPackages();
      fetchStatistics();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedTour(null);
    } catch (err) {
      setError('Failed to reject tour. Please try again.');
      console.error('Error rejecting tour:', err);
    } finally {
      setProcessingTours((prev: Set<number>) => {
        const newSet = new Set(prev);
        newSet.delete(selectedTour.id);
        return newSet;
      });
    }
  };

  const handleView = (tourId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/tour/${tourId}`);
  };

  // Toggle city filter
  const handleCityToggle = (city: City) => {
    setSelectedCities(prev => ({
      ...prev,
      [city]: !prev[city]
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
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
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
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

  // Get status color and config
  const getStatusConfig = (status: TourStatus) => {
    switch (status) {
      case 'pending_approval': 
        return { 
          color: 'bg-amber-100 text-amber-800 border-amber-200', 
          icon: <Clock className="w-3 h-3" />,
          label: 'Pending Review'
        };
      case 'published': 
        return { 
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Published'
        };
      case 'rejected': 
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: <XCircle className="w-3 h-3" />,
          label: 'Rejected'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: <AlertCircle className="w-3 h-3" />,
          label: 'Unknown'
        };
    }
  };

  // Quick actions data
  const quickActions: QuickAction[] = [
    {
      id: 'pending',
      title: 'Pending Reviews',
      count: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: 'amber'
    },
    {
      id: 'published',
      title: 'Published Tours',
      count: stats.published,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'emerald'
    },
    {
      id: 'rejected',
      title: 'Rejected Tours',
      count: stats.rejected,
      icon: <XCircle className="w-5 h-5" />,
      color: 'red'
    }
  ];

  const activeFiltersCount = Object.values(selectedCities).filter(Boolean).length + 
    (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="px-4 mx-auto py-6 max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage and review tour packages submitted by guides
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-900">{totalItems}</span> tours
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <div 
              key={action.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                selectedTab === action.id.toUpperCase() ? `ring-2 ring-${action.color}-500` : ''
              }`}
              onClick={() => setSelectedTab(action.id.toUpperCase() as StatusTab)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
                    {action.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {action.count}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${action.color}-100 text-${action.color}-600`}>
                  {action.icon}
                </div>
              </div>
              {selectedTab === action.id.toUpperCase() && (
                <div className={`mt-3 text-xs font-medium text-${action.color}-600`}>
                  Currently viewing
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="xl:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              {/* Mobile Filter Toggle */}
              <div className="xl:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium">Filters</span>
                  <div className="flex items-center space-x-2">
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              </div>

              <div className={`space-y-6 ${!showFilters ? 'hidden xl:block' : ''}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Tours</label>
                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by title, guide name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-xs font-medium text-gray-500">From</label>
                      <div className="relative">
                        <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full py-2.5 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full py-2.5 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Locations</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedCities).map(([city, checked]) => (
                      <label 
                        key={city}
                        className={`flex items-center space-x-3 text-sm p-3 rounded-lg cursor-pointer transition-colors border ${
                          checked 
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCityToggle(city as City)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="capitalize font-medium">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All Filters ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin mb-4"></div>
                <p className="text-gray-600">Loading tours...</p>
              </div>
            ) : (
              <>
                {/* Tours Grid */}
                <div className="space-y-6">
                  {tours.length > 0 ? (
                    tours.map((tour) => {
                      const statusConfig = getStatusConfig(tour.status);
                      const isProcessing = processingTours.has(tour.id);
                      
                      return (
                        <div 
                          key={tour.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex flex-col lg:flex-row">
                            {/* Tour Image */}
                            <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                              <img 
                                src={tour.image_url} 
                                alt={tour.title} 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color} backdrop-blur-sm`}>
                                <div className="flex items-center space-x-1">
                                  {statusConfig.icon}
                                  <span>{statusConfig.label}</span>
                                </div>
                              </div>
                            </div>

                            {/* Tour Content */}
                            <div className="flex-1 p-6">
                              <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {tour.title}
                                      </h3>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center">
                                          <Clock className="w-4 h-4 mr-1.5" />
                                          <span>{formatDuration(tour.duration_minutes)}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-1.5" />
                                          <span>{tour.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Calendar className="w-4 h-4 mr-1.5" />
                                          <span>{formatDate(tour.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Guide Info */}
                                    <div className="flex items-center space-x-3 ml-4">
                                      <img 
                                        src={tour.guide.avatar_url} 
                                        alt={tour.guide.name} 
                                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                                        loading="lazy"
                                      />
                                      <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{tour.guide.name}</p>
                                        <p className="text-xs text-gray-500">Tour Guide</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {tour.description}
                                  </p>

                                  {/* Rejection Reason */}
                                  {tour.rejection_reason && (
                                    <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
                                      <p className="text-sm text-red-700">
                                        <strong className="flex items-center mb-1">
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Rejection Reason:
                                        </strong>
                                        {tour.rejection_reason}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                                  <div className="text-2xl font-bold text-blue-600 mb-3 sm:mb-0">
                                    ${tour.price.toFixed(2)}
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={(e) => handleView(tour.id, e)}
                                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </button>
                                    
                                    {tour.status === 'pending_approval' && (
                                      <>
                                        <button
                                          onClick={(e) => handleApprove(tour.id, e)}
                                          disabled={isProcessing}
                                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                          {isProcessing ? (
                                            <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                          ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                          )}
                                          Approve
                                        </button>
                                        
                                        <button
                                          onClick={(e) => handleReject(tour, e)}
                                          disabled={isProcessing}
                                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center bg-white rounded-xl shadow-sm">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                          {searchQuery 
                            ? `No tours match your search for "${searchQuery}".`
                            : 'There are no tours matching your current filters.'}
                        </p>
                        <button 
                          onClick={clearAllFilters}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-between mt-12 space-y-4 sm:flex-row sm:space-y-0 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === 1
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
                      
                      <div className="hidden sm:flex items-center space-x-1">
                        {getPageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'text-white bg-blue-600 hover:bg-blue-700'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="px-2 text-gray-500">...</span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Reject Tour</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                You are about to reject the following tour:
              </p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">"{selectedTour.title}"</p>
                <p className="text-sm text-gray-600">by {selectedTour.guide.name}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection..."
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">
                This reason will be visible to the tour guide.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${
                  rejectReason.trim() 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                Reject Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;