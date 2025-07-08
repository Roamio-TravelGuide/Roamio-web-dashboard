import React, { useState } from 'react';
import { FaSearch, FaExclamationTriangle, FaCheck, FaEye, FaTimes } from 'react-icons/fa';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  reportedUser: {
    id: string;
    name: string;
    role: string;
  };
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
  evidence?: string[];
  additionalNotes?: string;
}

const ITEMS_PER_PAGE = 6;

const Complaints = () => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Inappropriate behavior',
      description: 'User was harassing other participants during the tour by making unwanted advances and offensive comments.',
      status: 'pending',
      reportedUser: { id: '101', name: 'John Doe', role: 'traveler' },
      reporter: { id: '201', name: 'Sarah Wilson', email: 'sarah@example.com' },
      createdAt: '2023-05-15T10:30:00Z',
      evidence: [
        'chat_screenshot_1.png',
        'tour_recording_excerpt.mp4'
      ],
      additionalNotes: 'Multiple participants reported similar behavior'
    },
    {
      id: '2',
      title: 'Fake profile',
      description: 'User appears to be using fake identification documents and stolen profile pictures.',
      status: 'resolved',
      reportedUser: { id: '102', name: 'Mike Johnson', role: 'tour_guide' },
      reporter: { id: '202', name: 'David Brown', email: 'david@example.com' },
      createdAt: '2023-06-20T14:45:00Z',
      updatedAt: '2023-06-22T09:15:00Z',
      evidence: [
        'profile_comparison.jpg',
        'id_document.pdf'
      ]
    },
    {
      id: '3',
      title: 'Late arrival',
      description: 'Guide arrived 45 minutes late to the scheduled tour without prior notice, causing inconvenience.',
      status: 'pending',
      reportedUser: { id: '103', name: 'Emily Davis', role: 'tour_guide' },
      reporter: { id: '203', name: 'Robert Taylor', email: 'robert@example.com' },
      createdAt: '2023-06-25T08:15:00Z',
      additionalNotes: 'Tour was eventually conducted but shortened'
    },
    {
      id: '4',
      title: 'Poor equipment quality',
      description: 'Rented equipment was in bad condition and malfunctioning during critical moments of the activity.',
      status: 'resolved',
      reportedUser: { id: '104', name: 'Adventure Gear Co.', role: 'vendor' },
      reporter: { id: '204', name: 'Lisa Miller', email: 'lisa@example.com' },
      createdAt: '2023-06-18T11:20:00Z',
      updatedAt: '2023-06-20T14:30:00Z',
      evidence: [
        'equipment_photo_1.jpg',
        'equipment_photo_2.jpg'
      ]
    }
  ]);

  // Filter complaints based on selected status and search term
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const currentComplaints = filteredComplaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setStatusDropdownOpen(false);
  };

  const resolveComplaint = (id: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { ...complaint, status: 'resolved', updatedAt: new Date().toISOString() }
        : complaint
    ));
    setIsModalOpen(false);
  };

  const openComplaintModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const closeComplaintModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusBadge = (status: string) => {
    const colorClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClasses[status as keyof typeof colorClasses]}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'resolved':
        return <FaCheck className="text-green-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {selectedStatus === 'all' ? 'All Complaints' : 
           selectedStatus === 'pending' ? 'Pending Complaints' :
           selectedStatus === 'resolved' ? 'Resolved Complaints' : 'Rejected Complaints'}
        </h3>
        
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search complaints..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <span className="font-medium">Filter Status</span>
              {statusDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            
            {statusDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusSelect('all')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedStatus === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    All Complaints
                  </button>
                  <button
                    onClick={() => handleStatusSelect('pending')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedStatus === 'pending' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaExclamationTriangle className="mr-2 text-yellow-500" />
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusSelect('resolved')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedStatus === 'resolved' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaCheck className="mr-2 text-green-500" />
                    Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4 mb-8">
        {currentComplaints.map(complaint => (
          <div key={complaint.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{complaint.title}</h4>
                  <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                  
                  <div className="mt-3 flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      Reported User: <span className="font-medium">{complaint.reportedUser.name}</span> ({complaint.reportedUser.role})
                    </span>
                    <span className="flex items-center">
                      {getStatusIcon(complaint.status)}
                      <span className="ml-2">
                        {getStatusBadge(complaint.status)}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                  {complaint.updatedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => openComplaintModal(complaint)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaEye />
                  View Details
                </button>
                {complaint.status === 'pending' && (
                  <button 
                    onClick={() => resolveComplaint(complaint.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <FaCheck />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complaint Details Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedComplaint.title}</h3>
                <button 
                  onClick={closeComplaintModal}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-line">{selectedComplaint.description}</p>
                  </div>
                  
                  {selectedComplaint.additionalNotes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Additional Notes</h4>
                      <p className="text-gray-700 whitespace-pre-line">{selectedComplaint.additionalNotes}</p>
                    </div>
                  )}
                  
                  {selectedComplaint.evidence && selectedComplaint.evidence.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Evidence</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedComplaint.evidence.map((file, index) => (
                          <div key={index} className="border rounded p-2 bg-gray-50">
                            <span className="text-sm text-gray-700">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Report Details</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-500">Status:</span> 
                        <span className="ml-2">{getStatusBadge(selectedComplaint.status)}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Reported User:</span> 
                        <span className="ml-2 font-medium">{selectedComplaint.reportedUser.name}</span>
                        <span className="ml-2 text-sm">({selectedComplaint.reportedUser.role})</span>
                      </p>
                      {selectedComplaint.reporter && (
                        <p>
                          <span className="text-gray-500">Reporter:</span> 
                          <span className="ml-2 font-medium">{selectedComplaint.reporter.name}</span>
                          <span className="ml-2 text-sm">({selectedComplaint.reporter.email})</span>
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">Created:</span> 
                        <span className="ml-2">{new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                      </p>
                      {selectedComplaint.updatedAt && (
                        <p>
                          <span className="text-gray-500">Last Updated:</span> 
                          <span className="ml-2">{new Date(selectedComplaint.updatedAt).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedComplaint.status === 'pending' && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => resolveComplaint(selectedComplaint.id)}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        <FaCheck />
                        Resolve Complaint
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === page ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Show empty state if no complaints found */}
      {filteredComplaints.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h4 className="text-lg font-medium text-gray-700">No complaints found</h4>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Complaints;