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
} from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const ITEMS_PER_PAGE = 6;
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
  // When you get your users data:
  setStats({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    blocked: users.filter(u => u.status === 'blocked').length
  });
}, [users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: {
            role: selectedUserType === "all" ? undefined : selectedUserType,
            search: searchTerm,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.data.data) {
          throw new Error("Invalid response structure");
        }

        const transformedUsers = response.data.data.map((user) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone_no,
          status: user.status.toLowerCase(),
          role: user.role,
          avatar: user.profile_picture_url || "/default-avatar.png",
          registeredDate: user.registered_date,
          lastLogin: user.last_login,
          bio: user.bio,
          totalBookings: user.traveler_count || 0,
          totalReviews: user.report_count || 0,
          averageRating: 0,
        }));

        setUsers(transformedUsers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
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
        status: newStatus,
      });

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

      {/* User Cards */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-200"
                  onClick={() => openUserModal(user)}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            user.status === "active"
                              ? "bg-green-500"
                              : user.status === "blocked"
                              ? "bg-red-500"
                              : user.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg truncate">
                          {user.name}
                        </h4>
                        <p className="text-gray-600 text-sm truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              user.role === "traveler"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "tour_guide"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "moderator"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role.replace("_", " ")}
                          </span>
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1.5" />
                        <span>
                          {new Date(user.registeredDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUserModal(user);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
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
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={users.length < ITEMS_PER_PAGE}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }} // Changed to transparent background
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
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        selectedUser.role === "traveler"
                          ? "bg-purple-100 text-purple-800"
                          : selectedUser.role === "tour_guide"
                          ? "bg-blue-100 text-blue-800"
                          : selectedUser.role === "moderator"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.role.replace("_", " ")}
                    </span>
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

                      {selectedUser.lastLogin && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaCalendarAlt className="text-green-500" />
                            <span>Last Login</span>
                          </h4>
                          <p className="text-gray-600">
                            {new Date(selectedUser.lastLogin).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      )}
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

                    {/* Activity Stats */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4">
                        Activity
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                              <FaBook className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bookings</p>
                              <p className="font-bold text-lg">
                                {selectedUser.totalBookings}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                              <FaComment className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Reviews</p>
                              <p className="font-bold text-lg">
                                {selectedUser.totalReviews}
                              </p>
                            </div>
                          </div>
                        </div>
                        {selectedUser.role !== "traveler" &&
                          selectedUser.averageRating !== undefined && (
                            <div className="bg-white p-3 rounded-lg shadow border border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                  <FaStar className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Rating
                                  </p>
                                  <p className="font-bold text-lg">
                                    {selectedUser.averageRating || 0}/5
                                  </p>
                                </div>
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
