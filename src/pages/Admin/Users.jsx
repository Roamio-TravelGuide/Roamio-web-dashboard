import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaUserShield, FaStore, FaSearch, FaTimes } from 'react-icons/fa';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ITEMS_PER_PAGE = 6;
const API_BASE_URL = 'http://localhost:3001/api/v1';

const Users = () => {
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: {
            role: selectedUserType === 'all' ? undefined : selectedUserType,
            search: searchTerm,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.data.data) {
          throw new Error('Invalid response structure');
        }

        const transformedUsers = response.data.data.map((user) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone_no,
          status: user.status.toLowerCase(),
          role: user.role,
          avatar: user.profile_picture_url || '/default-avatar.png',
          registeredDate: user.registered_date,
          lastLogin: user.last_login,
          bio: user.bio,
          totalBookings: user.traveler_count || 0,
          totalReviews: user.report_count || 0,
          averageRating: 0,
        }));

        setUsers(transformedUsers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
        setError(errorMessage);
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [selectedUserType, searchTerm, currentPage]);

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    setCurrentPage(1);
    setUsersDropdownOpen(false);
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      active: 'bg-green-100 text-green-800',
      banned: 'bg-red-100 text-red-800',
      blocked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const updateUserStatus = async (newStatus) => {
    if (!selectedUser) return;

    try {
      await axios.patch(`${API_BASE_URL}/users/${selectedUser.id}/status`, {
        status: newStatus
      });

      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, status: newStatus } 
          : u
      );
      
      setUsers(updatedUsers);
      setSelectedUser({
        ...selectedUser,
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {selectedUserType === 'all' ? 'All Users' : 
           selectedUserType === 'tour_guide' ? 'Tour Guides' :
           selectedUserType === 'traveler' ? 'Travelers' :
           selectedUserType === 'moderator' ? 'Moderators' : 'Vendors'}
        </h3>
        
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Users Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <span className="font-medium">Filter Users</span>
              {usersDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            
            {usersDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => handleUserTypeSelect('all')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedUserType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaUser className="mr-2" />
                    All Users
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect('traveler')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedUserType === 'traveler' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaUser className="mr-2" />
                    Travelers
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect('tour_guide')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedUserType === 'tour_guide' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaUserTie className="mr-2" />
                    Tour Guides
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect('moderator')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedUserType === 'moderator' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaUserShield className="mr-2" />
                    Moderators
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect('vendor')}
                    className={`flex w-full items-center px-4 py-2 text-sm ${selectedUserType === 'vendor' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FaStore className="mr-2" />
                    Vendors
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h4 className="text-lg font-medium text-red-600">Error</h4>
          <p className="text-gray-500 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* User Cards */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.length > 0 ? (
              users.map(user => (
                <div 
                  key={user.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openUserModal(user)}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{user.name}</h4>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <div className="mt-1">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                            {user.role.replace('_', ' ')}
                          </span>
                          <span className="ml-2">
                            {getStatusBadge(user.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Joined: {new Date(user.registeredDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                <h4 className="text-lg font-medium text-gray-700">No users found</h4>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={users.length < ITEMS_PER_PAGE}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeUserModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedUser.name}'s Profile</h3>
                <button 
                  onClick={closeUserModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full">
                    {selectedUser.status === 'pending' && (
                      <button
                        onClick={() => updateUserStatus('active')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors w-full"
                      >
                        Approve User
                      </button>
                    )}
                    
                    {selectedUser.status !== 'pending' && (
                      <button
                        onClick={() => updateUserStatus(selectedUser.status === 'blocked' ? 'active' : 'blocked')}
                        className={`px-4 py-2 rounded-lg font-medium w-full ${
                          selectedUser.status === 'blocked' 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        } transition-colors`}
                      >
                        {selectedUser.status === 'blocked' ? 'Unblock User' : 'Block User'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-500 text-sm">Name</p>
                            <p className="font-medium">{selectedUser.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Email</p>
                            <p className="font-medium">{selectedUser.email}</p>
                          </div>
                          {selectedUser.phone && (
                            <div>
                              <p className="text-gray-500 text-sm">Phone</p>
                              <p className="font-medium">{selectedUser.phone}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500 text-sm">Role</p>
                            <p className="font-medium capitalize">{selectedUser.role.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Status</p>
                            <div className="font-medium">{getStatusBadge(selectedUser.status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Activity</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-500 text-sm">Joined</p>
                            <p className="font-medium">{new Date(selectedUser.registeredDate).toLocaleDateString()}</p>
                          </div>
                          {selectedUser.lastLogin && (
                            <div>
                              <p className="text-gray-500 text-sm">Last Login</p>
                              <p className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                            </div>
                          )}
                          {selectedUser.totalBookings !== undefined && (
                            <div>
                              <p className="text-gray-500 text-sm">Total Bookings</p>
                              <p className="font-medium">{selectedUser.totalBookings}</p>
                            </div>
                          )}
                          {selectedUser.totalReviews !== undefined && (
                            <div>
                              <p className="text-gray-500 text-sm">Total Reviews</p>
                              <p className="font-medium">{selectedUser.totalReviews}</p>
                            </div>
                          )}
                          {selectedUser.averageRating !== undefined && (
                            <div>
                              <p className="text-gray-500 text-sm">Average Rating</p>
                              <p className="font-medium">{selectedUser.averageRating}/5</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.bio && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
                      <p className="text-gray-600 whitespace-pre-line">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;