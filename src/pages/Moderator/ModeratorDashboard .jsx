// import React, { useState, useEffect } from 'react';
// import { Calendar, MapPin, Users, X, Search, Filter, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ModeratorDashboard = () => {
//   // State management
//   const [selectedTab, setSelectedTab] = useState('PENDING');
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedTour, setSelectedTour] = useState(null);
//   const [rejectReason, setRejectReason] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [itemsPerPage] = useState(3);

//   const [selectedCities, setSelectedCities] = useState({
//     galle: false,
//     matara: false,
//     colombo: false,
//     jaffna: false,
//     kandy: false,
//     rhoafa: false,
//     food: false
//   });
//   const [tours, setTours] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({ 
//     pending: 0, 
//     published: 0, 
//     rejected: 0 
//   });

//   const API_BASE_URL = 'http://localhost:3001/api/v1';

//   // Convert API response to component format
//   const convertApiResponseToTour = (apiTour) => {
//     return {
//       id: apiTour.id,
//       title: apiTour.title,
//       description: apiTour.description || '',
//       duration_minutes: apiTour.duration_minutes,
//       location: apiTour.title,
//       guide: {
//         id: apiTour.guide?.user?.id || apiTour.guide_id,
//         name: apiTour.guide?.user?.name || 'Unknown Guide',
//         avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
//       },
//       price: apiTour.price,
//       status: apiTour.status,
//       image_url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
//       created_at: apiTour.created_at,
//       tags: [],
//       rejection_reason: apiTour.rejection_reason
//     };
//   };

//   // Fetch tour packages
//   const fetchTourPackages = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const params = {
//         status: selectedTab.toLowerCase().replace('pending', 'pending_approval'),
//         search: searchQuery,
//         page: currentPage,
//         limit: itemsPerPage
//       };

//       const selectedCitiesList = Object.keys(selectedCities)
//         .filter(city => selectedCities[city]);
//       if (selectedCitiesList.length > 0) {
//         params.location = selectedCitiesList.join(',');
//       }

//       if (dateFrom) {
//         params.dateFrom = dateFrom;
//       }

//       if (dateTo) {
//         params.dateTo = dateTo;
//       }

//       const response = await axios.get(`${API_BASE_URL}/tour-packages`, {
//         params,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const responseData = response.data.data;
//       const apiTours = responseData?.packages || [];
//       const convertedTours = apiTours.map(convertApiResponseToTour);
      
//       setTours(convertedTours);
//       setTotalItems(responseData?.total || 0);
//       setTotalPages(Math.ceil((responseData?.total || 0) / itemsPerPage));
      
//     } catch (err) {
//       setError('Failed to load tours. Please try again.');
//       console.error('Error fetching tours:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch statistics
//   const fetchStatistics = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/tour-packages/statistics`);
//       setStats({
//         pending: response.data.data?.pending || 0,
//         published: response.data.data?.published || 0,
//         rejected: response.data.data?.rejected || 0
//       });
//     } catch (err) {
//       console.error('Error fetching statistics:', err);
//     }
//   };

//   // Reset to first page when filters change
//   const resetToFirstPage = () => {
//     setCurrentPage(1);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchTourPackages();
//     fetchStatistics();
//   }, []);

//   // Refetch when filters change (reset to page 1)
//   useEffect(() => {
//     resetToFirstPage();
//   }, [selectedTab, searchQuery, selectedCities, dateFrom, dateTo]);

//   // Refetch when page changes
//   useEffect(() => {
//     fetchTourPackages();
//   }, [currentPage, selectedTab, searchQuery, selectedCities, dateFrom, dateTo]);

//   // Handle tour approval
//   const handleApprove = async (tourId, event) => {
//     event.stopPropagation();
//     try {
//       await axios.patch(`${API_BASE_URL}/tour-packages/${tourId}/status`, {
//         status: 'published'
//       });
//       fetchTourPackages();
//       fetchStatistics();
//     } catch (err) {
//       setError('Failed to approve tour. Please try again.');
//       console.error('Error approving tour:', err);
//     }
//   };

//   // Handle tour rejection
//   const handleReject = (tour, event) => {
//     event.stopPropagation();
//     setSelectedTour(tour);
//     setShowRejectModal(true);
//   };

//   // Confirm rejection
//   const confirmReject = async () => {
//     if (!selectedTour || !rejectReason.trim()) return;
    
//     try {
//       await axios.patch(`${API_BASE_URL}/tour-packages/${selectedTour.id}/status`, {
//         status: 'rejected',
//         rejection_reason: rejectReason
//       });
      
//       fetchTourPackages();
//       fetchStatistics();
//       setShowRejectModal(false);
//       setRejectReason('');
//       setSelectedTour(null);
//     } catch (err) {
//       setError('Failed to reject tour. Please try again.');
//       console.error('Error rejecting tour:', err);
//     }
//   };

//   const handleView = (tourId, event) => {
//     event.stopPropagation();
//     navigate(`/tour/${tourId}`);
//   };

//   // Toggle city filter
//   const handleCityToggle = (city) => {
//     setSelectedCities(prev => ({
//       ...prev,
//       [city]: !prev[city]
//     }));
//   };

//   // Pagination handlers
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 5; i++) {
//           pages.push(i);
//         }
//       } else if (currentPage >= totalPages - 2) {
//         for (let i = totalPages - 4; i <= totalPages; i++) {
//           pages.push(i);
//         }
//       } else {
//         for (let i = currentPage - 2; i <= currentPage + 2; i++) {
//           pages.push(i);
//         }
//       }
//     }
    
//     return pages;
//   };

//   // Format duration
//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
//       case 'published': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="px-4 mx-auto py-8 max-w-[90%] sm:px-6 lg:px-8">
//         {error && (
//           <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
//             {error}
//           </div>
//         )}
        
//         <div className="flex flex-col gap-8 lg:flex-row">
//           {/* Sidebar */}
//           <aside className="w-full lg:w-72">
//             <div className="p-6 border shadow-lg bg-white/60 backdrop-blur-md border-white/30 rounded-xl" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   {totalItems} {totalItems === 1 ? 'Tour' : 'Tours'} Found
//                 </p>
//               </div>

//               {/* Status Tabs */}
//               <div className="mb-6 space-y-2">
//                 {[
//                   { status: 'PENDING', color: 'yellow', count: stats.pending },
//                   { status: 'PUBLISHED', color: 'green', count: stats.published },
//                   { status: 'REJECTED', color: 'red', count: stats.rejected }
//                 ].map((tab) => (
//                   <button
//                     key={tab.status}
//                     onClick={() => setSelectedTab(tab.status)}
//                     className={`w-full flex justify-between items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
//                       selectedTab === tab.status 
//                         ? `bg-${tab.color}-50 text-${tab.color}-700 border-l-4 border-${tab.color}-500`
//                         : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                     }`}
//                   >
//                     <span className="font-medium">{tab.status}</span>
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       selectedTab === tab.status 
//                         ? `bg-${tab.color}-100 text-${tab.color}-700`
//                         : 'bg-white text-gray-600'
//                     }`}>
//                       {tab.count}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {/* Date Filter */}
//               <div className="mb-6">
//                 <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-700 uppercase">Date Range</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block mb-1 text-xs font-medium text-gray-500">From</label>
//                     <div className="relative">
//                       <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
//                       <input
//                         type="date"
//                         value={dateFrom}
//                         onChange={(e) => setDateFrom(e.target.value)}
//                         className="w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block mb-1 text-xs font-medium text-gray-500">To</label>
//                     <div className="relative">
//                       <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
//                       <input
//                         type="date"
//                         value={dateTo}
//                         onChange={(e) => setDateTo(e.target.value)}
//                         className="w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Cities Filter */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">Locations</h3>
//                   <div className="p-1 bg-gray-100 rounded-md">
//                     <Filter className="w-4 h-4 text-gray-500" />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   {Object.entries(selectedCities).map(([city, checked]) => (
//                     <label 
//                       key={city}
//                       className={`flex items-center space-x-2 text-sm p-2 rounded-md cursor-pointer transition-colors ${
//                         checked 
//                           ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                           : 'hover:bg-gray-50'
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => handleCityToggle(city)}
//                         className={`w-4 h-4 rounded ${
//                           checked ? 'text-blue-600 border-blue-300' : 'text-gray-400 border-gray-300'
//                         } focus:ring-blue-500`}
//                       />
//                       <span className="capitalize">{city}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Search */}
//             <div className="mb-6">
//               <div className="relative max-w-md">
//                 <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
//                 <input
//                   type="text"
//                   placeholder="Search tours..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Loading State */}
//             {isLoading ? (
//               <div className="flex items-center justify-center p-12">
//                 <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
//               </div>
//             ) : (
//               <>
//                 {/* Tour Cards */}
//                 <div className="space-y-6">
//                   {tours.length > 0 ? (
//                     tours.map((tour) => (
//                       <div 
//                         key={tour.id}
//                         className="overflow-hidden bg-white/60 backdrop-blur-md rounded-lg shadow-lg transition-transform hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border border-white/30" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
//                         <div className="flex flex-col md:flex-row">
//                           <div className="flex-shrink-0 w-full h-48 md:w-64 md:h-auto">
//                             <img 
//                               src={tour.image_url} 
//                               alt={tour.title} 
//                               className="object-cover w-full h-full"
//                               loading="lazy"
//                             />
//                           </div>
//                           <div className="flex-1 p-6">
//                             <div className="flex flex-col justify-between mb-4 space-y-3 sm:flex-row sm:space-y-0">
//                               <div>
//                                 <h3 className="text-xl font-semibold text-gray-900">{tour.title}</h3>
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   {tour.tags?.map(tag => (
//                                     <span key={tag} className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
//                                       {tag}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                               <div className="flex items-start space-x-3">
//                                 <img 
//                                   src={tour.guide.avatar_url} 
//                                   alt={tour.guide.name} 
//                                   className="w-10 h-10 rounded-full"
//                                   loading="lazy"
//                                 />
//                                 <div className="text-right">
//                                   <span className="block text-sm font-medium">{tour.guide.name}</span>
//                                   <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tour.status)}`}>
//                                     {tour.status.toUpperCase().replace('_', ' ')}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
//                               <div className="flex items-center">
//                                 <Calendar className="w-4 h-4 mr-1.5" />
//                                 <span>{formatDuration(tour.duration_minutes)}</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <MapPin className="w-4 h-4 mr-1.5" />
//                                 <span>{tour.location}</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <span className="text-xs text-gray-500">Posted: {formatDate(tour.created_at)}</span>
//                               </div>
//                             </div>

//                             <p className="mb-4 text-sm text-gray-600 line-clamp-2">{tour.description}</p>

//                             {tour.rejection_reason && (
//                               <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
//                                 <p className="text-sm text-red-700">
//                                   <strong>Rejection Reason:</strong> {tour.rejection_reason}
//                                 </p>
//                               </div>
//                             )}

//                             <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0 sm:items-center">
//                               <div className="text-xl font-bold text-teal-600">${tour.price.toFixed(2)}</div>
                              
//                               <div className="flex space-x-3">
//                                 <button
//                                   onClick={(e) => handleView(tour.id, e)}
//                                   className="px-6 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
//                                 >
//                                   View
//                                 </button>
//                                 {selectedTab === 'PENDING' && (
//                                   <>
//                                     <button
//                                       onClick={(e) => handleApprove(tour.id, e)}
//                                       className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                                     >
//                                       Approve
//                                     </button>
//                                     <button
//                                       onClick={(e) => handleReject(tour, e)}
//                                       className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                                     >
//                                       Reject
//                                     </button>
//                                   </>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-12 text-center bg-white rounded-lg shadow-sm">
//                       <div className="max-w-md mx-auto">
//                         <Search className="w-12 h-12 mx-auto text-gray-400" />
//                         <h3 className="mt-4 text-lg font-medium text-gray-900">No tours found</h3>
//                         <p className="mt-2 text-sm text-gray-500">
//                           {searchQuery 
//                             ? `No tours match your search for "${searchQuery}". Try a different search term.`
//                             : 'There are no tours matching your current filters.'}
//                         </p>
//                         <button 
//                           onClick={() => {
//                             setSearchQuery('');
//                             setSelectedCities({
//                               galle: false,
//                               matara: false,
//                               colombo: false,
//                               jaffna: false,
//                               kandy: false,
//                               rhoafa: false,
//                               food: false
//                             });
//                             setDateFrom('');
//                             setDateTo('');
//                           }}
//                           className="px-4 py-2 mt-4 text-sm font-medium text-teal-600 rounded-lg bg-teal-50 hover:bg-teal-100"
//                         >
//                           Reset all filters
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex flex-col items-center justify-between mt-8 space-y-4 sm:flex-row sm:space-y-0">
//                     {/* Results info */}
//                     <div className="text-sm text-gray-600">
//                       Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
//                     </div>
                    
//                     {/* Pagination controls */}
//                     <div className="flex items-center space-x-2">
//                       {/* Previous button */}
//                       <button
//                         onClick={handlePrevPage}
//                         disabled={currentPage === 1}
//                         className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                           currentPage === 1
//                             ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                             : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         <ChevronLeft className="w-4 h-4 mr-1" />
//                         Previous
//                       </button>
                      
//                       {/* Page numbers */}
//                       <div className="flex items-center space-x-1">
//                         {getPageNumbers().map((pageNum) => (
//                           <button
//                             key={pageNum}
//                             onClick={() => handlePageChange(pageNum)}
//                             className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                               currentPage === pageNum
//                                 ? 'text-white bg-teal-600 hover:bg-teal-700'
//                                 : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         ))}
                        
//                         {/* Show ellipsis and last page if needed */}
//                         {totalPages > 5 && currentPage < totalPages - 2 && (
//                           <>
//                             <span className="px-2 text-gray-500">...</span>
//                             <button
//                               onClick={() => handlePageChange(totalPages)}
//                               className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                             >
//                               {totalPages}
//                             </button>
//                           </>
//                         )}
//                       </div>
                      
//                       {/* Next button */}
//                       <button
//                         onClick={handleNextPage}
//                         disabled={currentPage === totalPages}
//                         className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                           currentPage === totalPages
//                             ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                             : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         Next
//                         <ChevronRight className="w-4 h-4 ml-1" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Reject Modal */}
//       {showRejectModal && selectedTour && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Reject Tour</h3>
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectReason('');
//                 }}
//                 className="text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <p className="mb-4 text-gray-600">
//               Please provide a reason for rejecting <span className="font-medium">"{selectedTour.title}"</span>
//             </p>
            
//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               placeholder="Enter rejection reason (required)..."
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               rows={4}
//               autoFocus
//             />
            
//             <div className="flex justify-end mt-6 space-x-3">
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectReason('');
//                 }}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmReject}
//                 disabled={!rejectReason.trim()}
//                 className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
//                   rejectReason.trim() ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed'
//                 }`}
//               >
//                 Confirm Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModeratorDashboard;

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, X, Search, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('PENDING');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    published: 0, 
    rejected: 0 
  });

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  const convertApiResponseToTour = (apiTour) => {
    return {
      id: apiTour.id,
      title: apiTour.title,
      description: apiTour.description || '',
      duration_minutes: apiTour.duration_minutes,
      location: apiTour.location || 'Multiple locations',
      guide: {
        id: apiTour.guide?.user?.id || apiTour.guide_id,
        name: apiTour.guide?.user?.name || 'Unknown Guide',
        avatar_url: apiTour.guide?.user?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      price: apiTour.price,
      status: apiTour.status,
      image_url: apiTour.cover_image_url || 'https://images.unsplash.com/photo-1505995433366-e12047f3f144?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      created_at: apiTour.created_at,
      rejection_reason: apiTour.rejection_reason
    };
  };

  const fetchTourPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        status: selectedTab,
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
  }, [selectedTab, searchQuery]);

  useEffect(() => {
    fetchTourPackages();
  }, [currentPage, selectedTab, searchQuery]);

  const handleApprove = async (tourId, event) => {
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

  const handleReject = (tour, event) => {
    event.stopPropagation();
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

  const handleView = (tourId, event) => {
    event.stopPropagation();
    navigate(`/tour/${tourId}`);
  };

  const handlePageChange = (page) => {
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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_approval': return 'Pending Review';
      case 'published': return 'Published';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-8xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tour Moderation Dashboard</h1>
          <p className="mt-1 text-gray-600">Review and manage tour submissions</p>
        </div>

        {/* Stats and Filters */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <div 
              onClick={() => setSelectedTab('PENDING')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors  ${selectedTab === 'PENDING' ? 'bg-yellow-100 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <h3 className="text-sm font-medium text-gray-500 ">Pending Review</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
            <div 
              onClick={() => setSelectedTab('PUBLISHED')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors  ${selectedTab === 'PUBLISHED' ? 'bg-green-100 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
            </div>
            <div 
              onClick={() => setSelectedTab('REJECTED')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors  ${selectedTab === 'REJECTED' ? 'bg-red-100 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Tours</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending + stats.published + stats.rejected}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search tours by title, guide, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} tours
            </div>
          </div>
        </div>

        {/* Tours Table */}
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : tours.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Tour
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Guide
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-md">
                            <img className="object-cover w-full h-full" src={tour.image_url} alt={tour.title} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                            <div className="text-sm text-gray-500">${tour.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-10 h-10 rounded-full" src={tour.guide.avatar_url} alt={tour.guide.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tour.guide.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tour.location}</div>
                        <div className="text-sm text-gray-500">{formatDuration(tour.duration_minutes)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tour.status)}`}>
                          {getStatusText(tour.status)}
                        </span>
                        {tour.rejection_reason && (
                          <div className="mt-1 text-xs text-gray-500 line-clamp-1">
                            {tour.rejection_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={(e) => handleView(tour.id, e)}
                          className="mr-4 text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tours found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery 
                  ? `No tours match your search for "${searchQuery}". Try a different search term.`
                  : 'There are no tours in this category.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reject Tour Submission</h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  You are about to reject the tour: <span className="font-medium text-gray-900">"{selectedTour.title}"</span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Please provide a clear reason for rejection. This feedback will be shared with the tour guide.
                </p>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Example: The audio quality is poor, images are low resolution, content needs more historical accuracy..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                autoFocus
              />
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
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
}

export default ModeratorDashboard;