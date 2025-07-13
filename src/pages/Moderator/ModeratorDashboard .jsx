

import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaStar, FaEye, FaSearch, FaChevronDown, 
  FaChartLine, FaUsers, FaFileAlt, FaClock, FaCalendarAlt,
  FaFilter, FaSort, FaHeart, FaShareAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  // Component for pagination
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>
              
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}
              
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => onPageChange(number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    currentPage === number
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };
  const [activeTab, setActiveTab] = useState('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const navigate = useNavigate();
  
  const [currentPages, setCurrentPages] = useState({
    pending_approval: 1,
    published: 1,
    rejected: 1
  });
  const [totalPages, setTotalPages] = useState({
    pending_approval: 1,
    published: 1,
    rejected: 1
  });
  const [totalItems, setTotalItems] = useState({
    pending_approval: 0,
    published: 0,
    rejected: 0
  });
  const [itemsPerPage] = useState(5);

  const [toursByStatus, setToursByStatus] = useState({
    pending_approval: [],
    published: [],
    rejected: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    published: 0, 
    rejected: 0,
    total: 0
  });

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  const statusTabs = [
    { 
      key: 'pending_approval', 
      label: 'Pending Review', 
      count: stats.pending,
      color: 'orange',
      description: 'Tours awaiting moderation approval'
    },
    { 
      key: 'published', 
      label: 'Published Tours', 
      count: stats.published,
      color: 'green',
      description: 'Live tours available to users'
    },
    { 
      key: 'rejected', 
      label: 'Rejected Tours', 
      count: stats.rejected,
      color: 'red',
      description: 'Tours that need revision'
    }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'colombo', label: 'Colombo' },
    { value: 'kandy', label: 'Kandy' },
    { value: 'galle', label: 'Galle' },
    { value: 'ella', label: 'Ella' },
    { value: 'sigiriya', label: 'Sigiriya' }
  ];

  const convertApiResponseToTour = (apiTour) => {
    // Debug log to see what we're getting from the API
    console.log('API Tour Data:', {
      id: apiTour.id,
      title: apiTour.title,
      cover_image_url: apiTour.cover_image_url
    });

    return {
      id: apiTour.id,
      title: apiTour.title,
      description: apiTour.description || 'Experience the beauty and culture of this amazing destination...',
      duration: apiTour.duration_minutes,
      location: apiTour.location || 'Multiple locations',
      guide: {
        name: apiTour.guide?.user?.name || 'Expert Guide',
        avatar: apiTour.guide?.user?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
        experience: apiTour.guide?.years_of_experience || Math.floor(Math.random() * 10) + 1,
        rating: 4.2 + Math.random() * 0.8 // Random rating between 4.2-5.0
      },
      price: apiTour.price,
      originalPrice: apiTour.price * 1.2, // Show discount
      status: apiTour.status,
      image: apiTour.cover_image_url, // Use actual S3 cover image URL
      images: [
        apiTour.cover_image_url
      ].filter(Boolean), // Remove null/undefined values
      createdAt: apiTour.created_at,
      rating: 4.1 + Math.random() * 0.9,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      availability: 'Available',
    };
  };

  const fetchTourPackages = async (statusToFetch = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Determine which statuses to fetch
      const statuses = statusToFetch ? [statusToFetch] : ['pending_approval', 'published', 'rejected'];
      
      const tourPromises = statuses.map(async (status) => {
        const currentPage = currentPages[status] || 1;
        const params = {
          status,
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage
        };

        if (selectedLocation !== 'all') {
          params.location = selectedLocation;
        }

        const response = await axios.get(`${API_BASE_URL}/tour-packages`, {
          params,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const responseData = response.data.data;
        const convertedTours = (responseData?.packages || []).map(convertApiResponseToTour);
        const total = responseData?.total || 0;
        const pages = Math.ceil(total / itemsPerPage);
        
        return { 
          status, 
          tours: convertedTours, 
          total,
          pages
        };
      });

      const results = await Promise.all(tourPromises);
      
      // Update state based on what was fetched
      if (statusToFetch) {
        // Update only specific status
        const result = results[0];
        setToursByStatus(prev => ({
          ...prev,
          [result.status]: result.tours
        }));
        setTotalPages(prev => ({
          ...prev,
          [result.status]: result.pages
        }));
        setTotalItems(prev => ({
          ...prev,
          [result.status]: result.total
        }));
      } else {
        // Update all statuses
        const organizedTours = {
          pending_approval: [],
          published: [],
          rejected: []
        };
        const newTotalPages = {
          pending_approval: 1,
          published: 1,
          rejected: 1
        };
        const newTotalItems = {
          pending_approval: 0,
          published: 0,
          rejected: 0
        };
        
        results.forEach(result => {
          organizedTours[result.status] = result.tours;
          newTotalPages[result.status] = result.pages;
          newTotalItems[result.status] = result.total;
        });
        
        setToursByStatus(organizedTours);
        setTotalPages(newTotalPages);
        setTotalItems(newTotalItems);
      }
      
    } catch (err) {
      setError('Failed to load tours. Please try again.');
      console.error('Error fetching tours:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tour-packages/statistics`);
      const data = response.data.data;
      setStats({
        pending: data?.pending || 0,
        published: data?.published || 0,
        rejected: data?.rejected || 0,
        total: (data?.pending || 0) + (data?.published || 0) + (data?.rejected || 0)
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    fetchTourPackages();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchTourPackages();
  }, [searchQuery, selectedLocation]);

  // Fetch specific status when page changes
  useEffect(() => {
    fetchTourPackages(activeTab);
  }, [currentPages]);

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPages(prev => ({
      ...prev,
      [activeTab]: 1
    }));
  }, [activeTab]);

  const handlePageChange = (page) => {
    setCurrentPages(prev => ({
      ...prev,
      [activeTab]: page
    }));
  };

  const handleView = (tourId) => {
    navigate(`/moderator/tour/${tourId}`);
  };

  // Get current tours based on active tab
  const getCurrentTours = () => {
    return toursByStatus[activeTab] || [];
  };

  const getCurrentStats = () => {
    const currentTab = statusTabs.find(tab => tab.key === activeTab);
    const currentPageNum = currentPages[activeTab];
    const totalPagesNum = totalPages[activeTab];
    const totalItemsNum = totalItems[activeTab];
    
    return {
      count: currentTab?.count || 0,
      label: currentTab?.label || '',
      description: currentTab?.description || '',
      currentPage: currentPageNum,
      totalPages: totalPagesNum,
      totalItems: totalItemsNum,
      itemsPerPage
    };
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending_approval: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tour Moderation Dashboard</h1>
              <p className="text-sm text-gray-600">Review and manage tour submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {Object.values(totalItems).reduce((sum, count) => sum + count, 0)} total tours
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Status Tabs */}
        <div className="py-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? `border-${tab.color}-500 text-${tab.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.key
                      ? `bg-${tab.color}-100 text-${tab.color}-800`
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Current Tab Info */}
        <div className="mb-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{getCurrentStats().label}</h2>
                <p className="mt-1 text-gray-600">{getCurrentStats().description}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span>{getCurrentTours().length} tours on this page</span>
                  <span>•</span>
                  <span>{getCurrentStats().totalItems} total in category</span>
                  {getCurrentStats().totalPages > 1 && (
                    <>
                      <span>•</span>
                      <span>Page {getCurrentStats().currentPage} of {getCurrentStats().totalPages}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Filters for current tab */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FaSearch className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : getCurrentTours().length > 0 ? (
          <div className="pb-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getCurrentTours().map((tour) => (
                <div key={tour.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg group">
                  {/* ...existing tour card content... */}
                  <div className="relative">
                    {tour.image ? (
                      <img 
                        src={tour.image} 
                        alt={tour.title}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          console.log('Image failed to load:', tour.image);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                    ) : null}
                    
                    {/* Fallback when no image */}
                    <div 
                      className={`w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${tour.image ? 'hidden' : 'flex'}`}
                      style={{ display: tour.image ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">No Image</p>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      {getStatusBadge(tour.status)}
                    </div>
                    <div className="absolute flex space-x-1 top-3 right-3">
                      <button className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <FaHeart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <FaShareAlt className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                   
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Location & Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="w-3 h-3 mr-1 text-yellow-400" />
                        <span className="text-sm font-medium">{tour.rating.toFixed(1)}</span>
                        <span className="ml-1 text-xs text-gray-500">({tour.reviewCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-semibold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600">
                      {tour.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {tour.description}
                    </p>

                   

                    {/* Guide Info */}
                    <div className="flex items-center mb-3">
                      <img 
                        src={tour.guide.avatar} 
                        alt={tour.guide.name}
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{tour.guide.name}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {tour.guide.experience}y exp
                      </span>
                    </div>

                    {/* Duration & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="w-3 h-3 mr-1" />
                        <span>{formatDuration(tour.duration)}</span>
                      </div>
                      <div className="text-right">
                        {tour.originalPrice > tour.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(tour.originalPrice)}
                          </span>
                        )}
                        <div className="font-semibold text-gray-900">
                          {formatPrice(tour.price)}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleView(tour.id)}
                      className="w-full py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg">
              <Pagination
                currentPage={getCurrentStats().currentPage}
                totalPages={getCurrentStats().totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <FaSearch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No tours found</h3>
            <p className="mb-4 text-gray-600">
              {searchQuery 
                ? `No tours match your search for "${searchQuery}" in ${getCurrentStats().label.toLowerCase()}`
                : `No tours in ${getCurrentStats().label.toLowerCase()} category`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('all');
                setSortBy('newest');
                setCurrentPages({
                  pending_approval: 1,
                  published: 1,
                  rejected: 1
                });
              }}
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;