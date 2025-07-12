import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaStar, FaCheckCircle, FaTimesCircle, 
  FaEye, FaSearch, FaChevronDown, FaShieldAlt, 
  FaChartLine, FaUsers, FaFileAlt, FaClock, FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('pending_approval');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8);

  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    published: 0, 
    rejected: 0 
  });

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  const statusOptions = [
    { value: 'pending_approval', label: 'Pending Review', icon: FaShieldAlt },
    { value: 'published', label: 'Published', icon: FaCheckCircle },
    { value: 'rejected', label: 'Rejected', icon: FaTimesCircle },
    { value: 'all', label: 'All Tours', icon: FaMapMarkerAlt }
  ];

  const convertApiResponseToTour = (apiTour) => {
    return {
      id: apiTour.id,
      title: apiTour.title,
      description: apiTour.description || 'No description provided',
      duration: apiTour.duration_minutes,
      location: apiTour.location || 'Multiple locations',
      guide: {
        name: apiTour.guide?.user?.name || 'Unknown Guide',
        avatar: apiTour.guide?.user?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
        experience: apiTour.guide?.years_of_experience || 0
      },
      price: apiTour.price,
      status: apiTour.status,
      image: apiTour.cover_image_url || 'https://source.unsplash.com/random/600x400/?travel',
      createdAt: apiTour.created_at,
      rejectionReason: apiTour.rejection_reason
    };
  };

  const fetchTourPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await axios.get(`${API_BASE_URL}/tour-packages`, {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = response.data.data;
      const convertedTours = (responseData?.packages || []).map(convertApiResponseToTour);
      
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

  useEffect(() => {
    fetchTourPackages();
    fetchStatistics();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchTourPackages();
  }, [currentPage, statusFilter, searchQuery]);

  const handleApprove = async (tourId) => {
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

  const handleReject = (tour) => {
    setSelectedTour(tour);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedTour || !rejectReason.trim()) return;
    
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
    }
  };

  const handleView = (tourId) => {
    navigate(`/moderator/tour/${tourId}`);
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
      pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', icon: FaShieldAlt },
      published: { bg: 'bg-teal-100', text: 'text-teal-800', icon: FaCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle }
    }[status] || { bg: 'bg-slate-100', text: 'text-slate-800', icon: FaFileAlt };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        <config.icon className="w-3 h-3 mr-1" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col max-w-2xl gap-2">
            <span className="text-sm font-medium tracking-wide text-teal-400">TOUR MODERATION</span>
            <h1 className="text-3xl font-light leading-tight text-white">Tour Review Dashboard</h1>
            <p className="text-slate-300">Review and approve tour submissions from guides</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-4">
            {statusOptions.map((option) => (
              <div 
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  statusFilter === option.value 
                    ? 'border-teal-300 bg-teal-50 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center">
                  <option.icon className={`w-5 h-5 mr-2 ${
                    option.value === 'pending_approval' ? 'text-amber-500' :
                    option.value === 'published' ? 'text-teal-500' :
                    option.value === 'rejected' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <h3 className="text-sm font-medium text-slate-700">{option.label}</h3>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {option.value === 'pending_approval' ? stats.pending :
                   option.value === 'published' ? stats.published :
                   option.value === 'rejected' ? stats.rejected : 
                   stats.pending + stats.published + stats.rejected}
                </p>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
            <div className="flex items-center w-full gap-3 md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-48">
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaSearch className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="relative flex-shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} tours
            </div>
          </div>

          {/* Tours Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : tours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tours.map((tour) => (
                  <div key={tour.id} className="overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl hover:shadow-md group">
                    {/* Tour Image */}
                    <div className="relative w-full h-48">
                      <img 
                        src={tour.image} 
                        alt={tour.title} 
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(tour.status)}
                      </div>
                    </div>
                    
                    {/* Tour Details */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{tour.title}</h3>
                          <div className="flex items-center mt-1 text-sm text-slate-500">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            <span>{tour.location}</span>
                          </div>
                        </div>
                        <div className="text-lg font-medium text-slate-900">${tour.price.toFixed(2)}</div>
                      </div>
                      
                      {/* Guide Info */}
                      <div className="flex items-center mb-4">
                        <img 
                          src={tour.guide.avatar} 
                          alt={tour.guide.name} 
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{tour.guide.name}</p>
                          {tour.guide.experience > 0 && (
                            <p className="text-xs text-slate-500">{tour.guide.experience} years experience</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Tour Meta */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-600">
                        <div className="flex items-center">
                          <FaClock className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{formatDuration(tour.duration)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{formatDate(tour.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Rejection Reason */}
                      {tour.rejectionReason && (
                        <div className="p-3 mb-4 text-xs text-red-700 rounded-lg bg-red-50">
                          <p className="font-medium">Rejection Reason:</p>
                          <p className="line-clamp-2">{tour.rejectionReason}</p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleView(tour.id)}
                          className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaEye className="w-3 h-3 mr-1.5" />
                          View
                        </button>
                        
                        {tour.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(tour.id)}
                              className="flex items-center px-3 py-1.5 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              <FaCheckCircle className="w-3 h-3 mr-1.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(tour)}
                              className="flex items-center px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FaTimesCircle className="w-3 h-3 mr-1.5" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border ${
                      currentPage === 1 
                        ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
                        : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex sm:space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2 py-2">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 border-slate-300 hover:bg-slate-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border ${
                      currentPage === totalPages
                        ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                        : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-white shadow-sm rounded-xl">
              <FaSearch className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-800">No tours found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {searchQuery 
                  ? `No tours match your search for "${searchQuery}"`
                  : 'There are no tours matching your current filters'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('pending_approval');
                }}
                className="px-4 py-2 mt-4 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white shadow-xl rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">Reject Tour Submission</h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="transition-colors text-slate-400 hover:text-slate-500"
                >
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-slate-600">
                  You are about to reject: <span className="font-medium text-slate-800">"{selectedTour.title}"</span>
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Please provide constructive feedback that will help the guide improve their submission.
                </p>
              </div>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Example: The audio quality needs improvement, images should be higher resolution, historical facts need verification..."
                className="w-full p-3 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                autoFocus
              />
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    rejectReason.trim() 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-red-300 cursor-not-allowed'
                  }`}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;