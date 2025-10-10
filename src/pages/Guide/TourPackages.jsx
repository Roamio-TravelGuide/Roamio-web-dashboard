  import React, { useState, useEffect } from "react";
  import LoadingSpinner from '../../components/ui/LoadingSpinner';
  import { 
    FaMapMarkerAlt, 
    FaStar, 
    FaCheckCircle, 
    FaEdit, 
    FaChartLine,
    FaShieldAlt, 
    FaSearch,
    FaTimesCircle, 
    FaChevronDown 
  } from "react-icons/fa";
  import { Link, useNavigate } from 'react-router-dom';
  import { getTourPackagesByGuideId } from "../../api/tour/tourApi";
  import { useAuth } from '../../contexts/authContext';

  const TourPackages = () => {
    const [statusFilter, setStatusFilter] = useState('published');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(8);
    const navigate = useNavigate();
    const { authState } = useAuth();

    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusOptions = [
      { value: 'pending_approval', label: 'Pending Review', icon: FaShieldAlt },
      { value: 'published', label: 'Published', icon: FaCheckCircle },
      { value: 'rejected', label: 'Rejected', icon: FaTimesCircle },
      { value: 'all', label: 'All Tours', icon: FaMapMarkerAlt }
    ];  

    const fetchTourPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters = {
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage
        };

        const response = await getTourPackagesByGuideId(authState.user.id, filters);
        // console.log(response);
        if (response.success) {
          setTours(response.data);
          setTotalItems(response.total);
          setTotalPages(Math.ceil(response.total / itemsPerPage));
        } else {
          throw new Error(response.message || 'Failed to fetch tours');
        }
        
      } catch (err) {
        setError('Failed to load tours. Please try again.');
        console.error('Error fetching tours:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const handleStatusFilterChange = (e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setCurrentPage(1);
      fetchTourPackages();
    };

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    useEffect(() => {
      fetchTourPackages();
    }, [statusFilter, currentPage, authState.user.id]);

    const getStatusBadge = (status) => {
      switch(status) {
        case 'published':
          return { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Published' };
        case 'pending_approval':
          return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Review' };
        case 'rejected':
          return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
        default:
          return { bg: 'bg-slate-100', text: 'text-slate-800', label: status };
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getImageUrl = (relativePath) => {
      if (!relativePath) return null;
      return `http://localhost:3001${relativePath}`;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col max-w-2xl gap-2">
                <span className="text-sm font-medium tracking-wide text-teal-400">TOUR MANAGEMENT</span>
                <h1 className="text-3xl font-light leading-tight text-white">My Tour Packages</h1>
                <p className="text-slate-300">Manage and analyze your audio tour offerings with detailed insights</p>
              </div>
              <Link
                to="/guide/tourcreate"
                className="flex items-center px-5 py-3 font-medium text-white transition-all duration-300 bg-teal-600 rounded-lg hover:bg-teal-700 hover:shadow-lg"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Create New Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pb-12 mt-5">
          <div className="mx-auto sm:px-6 lg:px-12">
            {/* Action Bar */}
            <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
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
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FaSearch className="w-4 h-4 text-slate-400" />
                  </button>
                </form>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size={32} className="text-indigo-600" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            ) : (
              <>
                {/* Tours Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tours.map((tour) => (

                    <div 
                      key={tour.id} 
                      className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl hover:shadow-lg group"
                      style={{
                        transform: 'translateZ(0)', // Hardware acceleration for smooth animation
                        willChange: 'transform, box-shadow' // Optimizes animation performance
                      }}
                    >
                      <Link 
                        to={`/guide/tour/view/${tour.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={`View ${tour.title}`}
                      />
                      

                      
                      {/* Card content with enhanced hover effects */}
                      <div className="relative flex flex-col h-full">
                        {/* Image container with hover zoom effect */}
                        <div className="relative w-full h-48 overflow-hidden">
                          {tour.cover_image?.url ? (
                            <img
                              src={`http://localhost:3001${tour.cover_image.url}`}
                              alt={tour.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                console.error('Image failed to load:', e.target.src);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                              <FaMapMarkerAlt className="w-8 h-8 opacity-50" />
                            </div>
                          )}
                          {/* Status badge with subtle hover effect */}
                          <div className="absolute transition-all duration-300 top-3 left-3 group-hover:top-4 group-hover:left-4">
                            <div className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${getStatusBadge(tour.status).bg} ${getStatusBadge(tour.status).text}`}>
                              {getStatusBadge(tour.status).label}
                            </div>
                          </div>
                        </div>

                      {/* Card body with enhanced typography and spacing */}
                      <div className="flex flex-col flex-grow p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold transition-colors duration-200 text-slate-800 group-hover:text-blue-600">
                              {tour.title}
                            </h3>
                            <div className="flex items-center mt-1 text-sm transition-colors duration-200 text-slate-500 group-hover:text-slate-600">
                              <FaMapMarkerAlt className="flex-shrink-0 w-3 h-3 mr-1" />
                              <span className="truncate">{tour.tour_stops?.[0]?.location?.city || 'No location specified'}</span>
                            </div>
                          </div>
                          <div className="flex items-center px-2 py-1 transition-colors duration-200 rounded-full bg-slate-100 group-hover:bg-slate-200">
                            <FaStar className="flex-shrink-0 w-3 h-3 mr-1 text-amber-400" />
                            <span className="text-xs font-medium">{tour.rating || '0'}</span>
                          </div>
                        </div>

                          {/* Details with subtle hover enhancements */}
                          <div className="flex-grow mb-4 space-y-2">
                            <div className="flex items-center">
                              <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                              <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                                Created: {formatDate(tour.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                              <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                                Duration: {tour.duration_minutes || 'N/A'} mins
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                              <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                                Price: ${tour.price || '0'}
                              </span>
                            </div>
                          </div>
                        {/* Details with subtle hover enhancements */}
                        <div className="flex-grow mb-4 space-y-2">
                          <div className="flex items-center">
                            <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                            <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                              Created: {formatDate(tour.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                            <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                              Duration: {tour.duration_minutes ? Math.round(tour.duration_minutes / 60) + ' mins' : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaCheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-teal-500" />
                            <span className="text-xs transition-colors duration-200 text-slate-600 group-hover:text-slate-700">
                              Price: LKR {Math.round(tour.price) || '0'}
                            </span>
                          </div>
                        </div>

                          {/* Footer with action buttons - appears on hover */}
                          <div className="pt-3 mt-auto border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="text-xs text-slate-500">Stops</div>
                                <div className="text-sm font-medium text-slate-800">{tour.tour_stops?.length || '0'}</div>
                              </div>
                              <div className="space-y-1 text-center">
                                <div className="text-xs text-slate-500">Last Updated</div>
                                <div className="text-sm font-medium text-slate-800">
                                  {tour.updated_at ? formatDate(tour.updated_at) : 'Never updated'}
                                </div>
                              </div>
                              <div className="flex space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                <Link
                                  to={`/guide/tours/${tour.id}/edit`}
                                  className="p-2 transition-all duration-200 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transform hover:-translate-y-0.5"
                                  title="Edit"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaEdit className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/guide/tours/${tour.id}/analytics`}
                                  className="p-2 transition-all duration-200 rounded-full text-slate-500 hover:text-purple-600 hover:bg-purple-50 transform hover:-translate-y-0.5"
                                  title="Analytics"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaChartLine className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  

                  {/* Add New Tour Card */}
                  <Link
                    to="/guide/tourcreate"
                    className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white border-2 border-dashed shadow-sm rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-3 transition-colors bg-blue-100 rounded-full group-hover:bg-blue-200">
                      <FaEdit className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-slate-800">Create New Tour</h3>
                    <p className="text-sm text-center text-slate-500">Design a new audio tour experience for your audience</p>
                  </Link>

                </div>
                

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                      >
                        &lt;
                      </button>
                      
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
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default TourPackages;