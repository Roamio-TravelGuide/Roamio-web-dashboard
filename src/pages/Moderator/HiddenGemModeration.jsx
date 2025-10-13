// HiddenGemsModeration.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaSearch, FaChevronDown, 
  FaFilter, FaSort, FaCheck, FaTimes, FaClock, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaImage, FaUser, 
  FaExclamationTriangle, FaSync, FaInfoCircle
} from 'react-icons/fa';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getMediaUrl } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { 
  getHiddenGemsForModeration, 
  updateHiddenGemStatus, 
  getModerationStats 
} from '../../api/moderator/moderatorApi';

const HiddenGemsModeration = () => {
  // Pagination Component
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

  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [itemsPerPage] = useState(6);
  const [hiddenGems, setHiddenGems] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    approved: 0, 
    rejected: 0,
    draft: 0,
    total: 0
  });

  const [successMessage, setSuccessMessage] = useState('');

  const statusTabs = [
    { 
      key: 'pending', 
      label: 'Pending Review', 
      count: stats.pending,
      color: 'orange',
      description: 'Hidden gems awaiting moderation approval'
    },
    { 
      key: 'approved', 
      label: 'Approved Gems', 
      count: stats.approved,
      color: 'green',
      description: 'Published hidden gems available to users'
    },
    { 
      key: 'rejected', 
      label: 'Rejected Gems', 
      count: stats.rejected,
      color: 'red',
      description: 'Gems that were not approved'
    },
    { 
      key: 'draft', 
      label: 'Drafts', 
      count: stats.draft,
      color: 'gray',
      description: 'Gems saved as drafts by travelers'
    }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title: A to Z' },
    { value: 'title_desc', label: 'Title: Z to A' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'colombo', label: 'Colombo' },
    { value: 'kandy', label: 'Kandy' },
    { value: 'galle', label: 'Galle' },
    { value: 'ella', label: 'Ella' },
    { value: 'nuwara eliya', label: 'Nuwara Eliya' },
    { value: 'mirissa', label: 'Mirissa' },
    { value: 'polonnaruwa', label: 'Polonnaruwa' }
  ];

  // Fetch hidden gems for moderation
  const fetchHiddenGems = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');

      const filters = {
        status: activeTab,
        search: searchQuery,
        location: selectedLocation,
        page,
        limit: itemsPerPage,
        sortBy: 'created_at',
        sortOrder: 'desc'
      };

      const response = await getHiddenGemsForModeration(filters);
      
      setHiddenGems(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalCount || 0);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('Error fetching hidden gems:', err);
      setError(err.message || 'Failed to load hidden gems. Please try again.');
      setHiddenGems([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch moderation statistics
  const fetchModerationStats = async () => {
    try {
      const response = await getModerationStats();
      setStats(response.data || {
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0,
        total: 0
      });
    } catch (err) {
      console.error('Error fetching moderation stats:', err);
      // Don't set error for stats failure, just use defaults
    }
  };

  // Update hidden gem status
  const updateGemStatus = async (gemId, status, rejectionReason = '') => {
    try {
      setIsActionLoading(true);
      setError(null);
      
      await updateHiddenGemStatus(gemId, { status, rejectionReason });
      
      setSuccessMessage(`Hidden gem ${status} successfully!`);
      
      // Refresh the data
      await fetchHiddenGems(currentPage);
      await fetchModerationStats();
      
      return true;
    } catch (err) {
      console.error('Error updating gem status:', err);
      setError(err.message || `Failed to ${status} hidden gem`);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchHiddenGems();
    fetchModerationStats();
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    fetchHiddenGems(1);
  }, [activeTab, searchQuery, selectedLocation]);

  const handlePageChange = (page) => {
    fetchHiddenGems(page);
  };

  const handleViewDetails = (gemId) => {
    navigate(`/moderator/hidden-gem/${gemId}`);
  };

  const handleApprove = async (gemId) => {
    const success = await updateGemStatus(gemId, 'approved');
    if (success) {
      console.log(`Hidden gem ${gemId} approved successfully`);
    }
  };

  const handleReject = async (gemId) => {
    const reason = prompt('Please provide a reason for rejection:', 'Does not meet guidelines');
    if (reason !== null) {
      const success = await updateGemStatus(gemId, 'rejected', reason);
      if (success) {
        console.log(`Hidden gem ${gemId} rejected successfully`);
      }
    }
  };

  const handleRequestInfo = async (gemId) => {
    const success = await updateGemStatus(gemId, 'draft', 'Need more information');
    if (success) {
      console.log(`Requested more info for gem ${gemId}`);
    }
  };

  const handleRefresh = () => {
    fetchHiddenGems(currentPage);
    fetchModerationStats();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSortBy('newest');
    fetchHiddenGems(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getCurrentStats = () => {
    const currentTab = statusTabs.find(tab => tab.key === activeTab);
    
    return {
      count: currentTab?.count || 0,
      label: currentTab?.label || '',
      description: currentTab?.description || '',
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage
    };
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Hidden Gems Moderation</h1>
              <p className="text-sm text-gray-600">Review and manage hidden gem submissions from travelers</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {stats.total} total hidden gems
              </span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
                title="Refresh data"
              >
                <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
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

        {/* Messages */}
        {error && (
          <div className="p-4 mb-6 border border-red-300 rounded-lg bg-red-50">
            <div className="flex items-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 mb-6 border border-green-300 rounded-lg bg-green-50">
            <div className="flex items-center">
              <FaCheck className="w-5 h-5 text-green-400" />
              <p className="ml-3 text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Current Tab Info */}
        <div className="mb-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{getCurrentStats().label}</h2>
                <p className="mt-1 text-gray-600">{getCurrentStats().description}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span>{hiddenGems.length} gems on this page</span>
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
              
              {/* Filters */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FaSearch className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search hidden gems..."
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

                {(searchQuery || selectedLocation !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 text-sm text-gray-600 transition-colors bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Gems Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size={32} className="text-indigo-600" />
            <span className="ml-3 text-gray-600">Loading hidden gems...</span>
          </div>
        ) : hiddenGems.length > 0 ? (
          <div className="pb-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hiddenGems.map((gem) => (
                <div key={gem.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg group">
                  {/* Image */}
                  <div className="relative">
                    {gem.picture?.url ? (
                      <img 
                        src={getMediaUrl(gem.picture.url)} 
                        alt={gem.title}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback when no image */}
                    <div 
                      className={`w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${gem.picture?.url ? 'hidden' : 'flex'}`}
                    >
                      <div className="text-center">
                        <FaImage className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">No Image</p>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      {getStatusBadge(gem.status)}
                    </div>
                    
                    {/* Action buttons for pending gems */}
                    {activeTab === 'pending' && (
                      <div className="absolute flex space-x-2 top-3 right-3">
                        <button
                          onClick={() => handleApprove(gem.id)}
                          disabled={isActionLoading}
                          className="p-2 transition-colors bg-green-500 rounded-full shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve"
                        >
                          <FaCheck className="w-3 h-3 text-white" />
                        </button>
                        <button
                          onClick={() => handleReject(gem.id)}
                          disabled={isActionLoading}
                          className="p-2 transition-colors bg-red-500 rounded-full shadow-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject"
                        >
                          <FaTimes className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Location & Date */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        <span>{gem.location?.city || gem.location?.district || 'Unknown Location'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        <span>{formatDate(gem.created_at)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-semibold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600">
                      {gem.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {gem.description || 'No description provided'}
                    </p>

                    {/* Traveler Info */}
                    <div className="flex items-center mb-4">
                      {gem.traveler?.user?.profile_picture_url ? (
                        <img 
                          src={getMediaUrl(gem.traveler.user.profile_picture_url)} 
                          alt={gem.traveler.user.name}
                          className="w-6 h-6 mr-2 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 mr-2 bg-gray-200 rounded-full">
                          <FaUser className="w-3 h-3 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {gem.traveler?.user?.name || 'Unknown Traveler'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Traveler
                        </p>
                      </div>
                    </div>

                    {/* Address & Coordinates */}
                    <div className="mb-4 space-y-1 text-xs text-gray-500">
                      <p className="truncate">{gem.location?.address || 'No address provided'}</p>
                      <p>{gem.location?.city}, {gem.location?.district}</p>
                      {gem.location?.latitude && gem.location?.longitude && (
                        <p>Coordinates: {gem.location.latitude.toFixed(4)}, {gem.location.longitude.toFixed(4)}</p>
                      )}
                    </div>

                    {/* Rejection Reason (if rejected) */}
                    {gem.rejection_reason && (
                      <div className="p-2 mb-4 border border-red-200 rounded bg-red-50">
                        <p className="text-xs font-medium text-red-800">Rejection Reason:</p>
                        <p className="text-xs text-red-700">{gem.rejection_reason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(gem.id)}
                        className="flex-1 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        View Details
                      </button>
                      {activeTab === 'pending' && (
                        <button
                          onClick={() => handleRequestInfo(gem.id)}
                          disabled={isActionLoading}
                          className="px-3 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                          Request Info
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white border border-gray-200 rounded-lg">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <FaInfoCircle className="w-16 h-16 mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No hidden gems found</h3>
              <p className="max-w-md mb-4 text-gray-600">
                {searchQuery || selectedLocation !== 'all'
                  ? `No hidden gems match your current filters in the ${getCurrentStats().label.toLowerCase()} category.`
                  : `There are no hidden gems in the ${getCurrentStats().label.toLowerCase()} category at the moment.`}
              </p>
              {(searchQuery || selectedLocation !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenGemsModeration;