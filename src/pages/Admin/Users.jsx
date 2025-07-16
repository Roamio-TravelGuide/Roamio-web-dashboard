import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserTie,
  FaUserShield,
  FaStore,
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaBook,
  FaComment,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = "http://localhost:3001/api/v1";

const Users = () => {
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    blocked: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Mock data for demonstration
        const mockUsers = [
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            status: "active",
            role: "traveler",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-15T10:00:00Z",
            lastLogin: "2024-01-20T15:30:00Z",
            bio: "Travel enthusiast who loves exploring new destinations and cultures.",
            totalBookings: 12,
            totalReviews: 8,
            averageRating: 4.5,
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            phone: "+1 (555) 987-6543",
            status: "active",
            role: "tour_guide",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-10T14:00:00Z",
            lastLogin: "2024-01-21T09:15:00Z",
            bio: "Professional tour guide with 5 years of experience in European destinations.",
            totalBookings: 45,
            totalReviews: 23,
            averageRating: 4.8,
          },
          {
            id: "3",
            name: "Mike Chen",
            email: "mike.chen@example.com",
            phone: "+1 (555) 456-7890",
            status: "pending",
            role: "vendor",
            avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-18T11:30:00Z",
            lastLogin: null,
            bio: "Local vendor specializing in authentic cultural experiences and crafts.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          },
          {
            id: "4",
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            phone: "+1 (555) 321-0987",
            status: "blocked",
            role: "traveler",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-05T16:45:00Z",
            lastLogin: "2024-01-19T12:00:00Z",
            bio: "Adventure seeker with a passion for mountain climbing and extreme sports.",
            totalBookings: 3,
            totalReviews: 1,
            averageRating: 3.0,
          },
          {
            id: "5",
            name: "David Martinez",
            email: "david.martinez@example.com",
            phone: "+1 (555) 654-3210",
            status: "active",
            role: "moderator",
            avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-01T08:00:00Z",
            lastLogin: "2024-01-21T10:45:00Z",
            bio: "Community moderator ensuring quality and safety standards across the platform.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          },
          {
            id: "6",
            name: "Lisa Park",
            email: "lisa.park@example.com",
            phone: "+1 (555) 789-0123",
            status: "active",
            role: "tour_guide",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-12T09:30:00Z",
            lastLogin: "2024-01-21T14:20:00Z",
            bio: "Experienced guide specializing in cultural and historical tours.",
            totalBookings: 32,
            totalReviews: 18,
            averageRating: 4.6,
          },
          {
            id: "7",
            name: "Alex Thompson",
            email: "alex.thompson@example.com",
            phone: "+1 (555) 234-5678",
            status: "pending",
            role: "vendor",
            avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-20T16:15:00Z",
            lastLogin: null,
            bio: "Vendor offering unique local experiences and handmade crafts.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          },
          {
            id: "8",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@example.com",
            phone: "+1 (555) 345-6789",
            status: "blocked",
            role: "traveler",
            avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-08T13:45:00Z",
            lastLogin: "2024-01-18T11:30:00Z",
            bio: "Travel blogger documenting adventures around the world.",
            totalBookings: 7,
            totalReviews: 4,
            averageRating: 3.5,
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setUsers(mockUsers);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        // For development, use mock data when API fails
        console.warn("API call failed, using mock data:", err);
        
        const mockUsers = [
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            status: "active",
            role: "traveler",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-15T10:00:00Z",
            lastLogin: "2024-01-20T15:30:00Z",
            bio: "Travel enthusiast who loves exploring new destinations and cultures.",
            totalBookings: 12,
            totalReviews: 8,
            averageRating: 4.5,
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            phone: "+1 (555) 987-6543",
            status: "active",
            role: "tour_guide",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-10T14:00:00Z",
            lastLogin: "2024-01-21T09:15:00Z",
            bio: "Professional tour guide with 5 years of experience in European destinations.",
            totalBookings: 45,
            totalReviews: 23,
            averageRating: 4.8,
          },
          {
            id: "3",
            name: "Mike Chen",
            email: "mike.chen@example.com",
            phone: "+1 (555) 456-7890",
            status: "pending",
            role: "vendor",
            avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-18T11:30:00Z",
            lastLogin: null,
            bio: "Local vendor specializing in authentic cultural experiences and crafts.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          },
          {
            id: "4",
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            phone: "+1 (555) 321-0987",
            status: "blocked",
            role: "traveler",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-05T16:45:00Z",
            lastLogin: "2024-01-19T12:00:00Z",
            bio: "Adventure seeker with a passion for mountain climbing and extreme sports.",
            totalBookings: 3,
            totalReviews: 1,
            averageRating: 3.0,
          },
          {
            id: "5",
            name: "David Martinez",
            email: "david.martinez@example.com",
            phone: "+1 (555) 654-3210",
            status: "active",
            role: "moderator",
            avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-01T08:00:00Z",
            lastLogin: "2024-01-21T10:45:00Z",
            bio: "Community moderator ensuring quality and safety standards across the platform.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          },
          {
            id: "6",
            name: "Lisa Park",
            email: "lisa.park@example.com",
            phone: "+1 (555) 789-0123",
            status: "active",
            role: "tour_guide",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-12T09:30:00Z",
            lastLogin: "2024-01-21T14:20:00Z",
            bio: "Experienced guide specializing in cultural and historical tours.",
            totalBookings: 32,
            totalReviews: 18,
            averageRating: 4.6,
          },
          {
            id: "7",
            name: "Alex Thompson",
            email: "alex.thompson@example.com",
            phone: "+1 (555) 234-5678",
            status: "pending",
            role: "vendor",
            avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
            registeredDate: "2024-01-20T16:15:00Z",
            lastLogin: null,
            bio: "Vendor offering unique local experiences and handmade crafts.",
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
          }
        ];
        setUsers(mockUsers);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setStats({
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      blocked: users.filter(u => u.status === 'blocked').length
    });
  }, [users]);

  // Filter users based on search term and selected type
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedUserType === "all" || user.role === selectedUserType;
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    setCurrentPage(1);
    setUsersDropdownOpen(false);
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      active: "bg-green-100 text-green-800",
      banned: "bg-red-100 text-red-800",
      blocked: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colorClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const colorClasses = {
      traveler: "bg-blue-900 text-white",
      tour_guide: "bg-blue-900 text-white",
      moderator: "bg-blue-900 text-white",
      vendor: "bg-blue-900 text-white",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          colorClasses[role] || "bg-gray-100 text-gray-800"
        }`}
      >
        {role.replace("_", " ")}
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
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      );

      setUsers(updatedUsers);
      setSelectedUser({
        ...selectedUser,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all platform users efficiently</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Users Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 w-full sm:w-auto justify-between"
            >
              <span className="font-medium">Filter Users</span>
              {usersDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>

            {usersDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => handleUserTypeSelect("all")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedUserType === "all"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaUser className="mr-2" />
                    All Users
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect("traveler")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedUserType === "traveler"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaUser className="mr-2" />
                    Travelers
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect("tour_guide")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedUserType === "tour_guide"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaUserTie className="mr-2" />
                    Tour Guides
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect("moderator")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedUserType === "moderator"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaUserShield className="mr-2" />
                    Moderators
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect("vendor")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedUserType === "vendor"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.total || <span className="text-gray-400">Loading...</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">All platform users</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active || <span className="text-gray-400">Loading...</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">Currently active</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Users</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending || <span className="text-gray-400">Loading...</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Blocked Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Blocked Users</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.blocked || <span className="text-gray-400">Loading...</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">Restricted access</p>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-red-600">
            Error Loading Users
          </h4>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="relative">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.src = "/default-avatar.png";
                                }}
                              />

                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <FaEye className="w-5 h-5 text-blue-900" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaUser className="text-gray-400 text-3xl" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700">
                        No users found
                      </h4>
                      <p className="text-gray-500 mt-2">
                        Try adjusting your search or filter criteria
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedUserType("all");
                          setCurrentPage(1);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginatedUsers.length > 0 && totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {totalPages > 1 && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }).filter(Boolean)}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={closeUserModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center mt-1 gap-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <button
                  onClick={closeUserModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Profile */}
                <div className="lg:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                          selectedUser.status === "active"
                            ? "bg-green-500"
                            : selectedUser.status === "blocked"
                            ? "bg-red-500"
                            : selectedUser.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      ></span>
                    </div>

                    <div className="w-full space-y-3">
                      {selectedUser.status === "pending" && (
                        <button
                          onClick={() => updateUserStatus("active")}
                          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          Approve User
                        </button>
                      )}

                      {selectedUser.status !== "pending" && (
                        <button
                          onClick={() =>
                            updateUserStatus(
                              selectedUser.status === "blocked"
                                ? "active"
                                : "blocked"
                            )
                          }
                          className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                            selectedUser.status === "blocked"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          } transition-colors`}
                        >
                          {selectedUser.status === "blocked"
                            ? "Unblock User"
                            : "Block User"}
                        </button>
                      )}
                    </div>

                    <div className="w-full mt-6 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-500" />
                          <span>Registration Date</span>
                        </h4>
                        <p className="text-gray-600">
                          {new Date(
                            selectedUser.registeredDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:w-2/3">
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4">
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <FaEnvelope className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{selectedUser.email}</p>
                          </div>
                        </div>

                        {selectedUser.phone && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full">
                              <FaPhone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">
                                {selectedUser.phone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Bio */}
                    {selectedUser.bio && (
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-800 mb-4">
                          About
                        </h4>
                        <p className="text-gray-600 whitespace-pre-line">
                          {selectedUser.bio}
                        </p>
                      </div>
                    )}
                  </div>
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