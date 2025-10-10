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
  FaTrash,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";

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
    // When you get your users data:
    setStats({
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      blocked: users.filter(u => u.status === 'blocked').length,
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

  const getRoleBadge = (role) => {
    const colorClasses = {
      traveler: "bg-purple-100 text-purple-800",
      tour_guide: "bg-blue-100 text-blue-800",
      moderator: "bg-orange-100 text-orange-800",
      vendor: "bg-green-100 text-green-800",
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

  const quickStatusUpdate = async (userId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/users/${userId}/status`, {
        status: newStatus,
      });

      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: newStatus } : u
      );

      setUsers(updatedUsers);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header and Filters */}
      <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all platform users efficiently</p>
        </div>

        <div className="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              <span className="font-medium">Filter Users</span>
              {usersDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>

            {usersDropdownOpen && (
              <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <div className="p-4 transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {isLoading ? <span className="text-gray-400">Loading...</span> : stats.total}
              </p>
              <p className="mt-1 text-xs text-gray-400">All platform users</p>
            </div>
            <div className="p-3 text-blue-600 rounded-full bg-blue-50">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="p-4 transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? <span className="text-gray-400">Loading...</span> : stats.active}
              </p>
              <p className="mt-1 text-xs text-gray-400">Currently active</p>
            </div>
            <div className="p-3 text-green-600 rounded-full bg-green-50">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending Users Card */}
        <div className="p-4 transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Users</p>
              <p className="text-2xl font-bold text-yellow-600">
                {isLoading ? <span className="text-gray-400">Loading...</span> : stats.pending}
              </p>
              <p className="mt-1 text-xs text-gray-400">Awaiting approval</p>
            </div>
            <div className="p-3 text-yellow-600 rounded-full bg-yellow-50">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Blocked Users Card */}
        <div className="p-4 transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Blocked Users</p>
              <p className="text-2xl font-bold text-red-600">
                {isLoading ? <span className="text-gray-400">Loading...</span> : stats.blocked}
              </p>
              <p className="mt-1 text-xs text-gray-400">Restricted access</p>
            </div>
            <div className="p-3 text-red-600 rounded-full bg-red-50">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <FaTimes className="text-2xl text-red-500" />
          </div>
          <h4 className="text-lg font-medium text-red-600">
            Error Loading Users
          </h4>
          <p className="mt-2 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && !error && (
        <>
          <div className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            
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
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(user.registeredDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaBook className="w-3 h-3 mr-1" />
                              {user.totalBookings}
                            </div>
                            <div className="flex items-center">
                              <FaComment className="w-3 h-3 mr-1" />
                              {user.totalReviews}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openUserModal(user)}
                              className="p-1 text-blue-600 transition-colors rounded hover:text-blue-900 hover:bg-blue-50"
                              title="View Details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            
                            {user.status === "pending" && (
                              <button
                                onClick={() => quickStatusUpdate(user.id, "active")}
                                className="p-1 text-green-600 transition-colors rounded hover:text-green-900 hover:bg-green-50"
                                title="Approve User"
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                            )}
                            
                            {user.status !== "pending" && (
                              <button
                                onClick={() => 
                                  quickStatusUpdate(
                                    user.id, 
                                    user.status === "blocked" ? "active" : "blocked"
                                  )
                                }
                                className={`p-1 rounded transition-colors ${
                                  user.status === "blocked"
                                    ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                                    : "text-red-600 hover:text-red-900 hover:bg-red-50"
                                }`}
                                title={user.status === "blocked" ? "Unblock User" : "Block User"}
                              >
                                {user.status === "blocked" ? (
                                  <FaCheck className="w-4 h-4" />
                                ) : (
                                  <FaBan className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                          <FaUser className="text-3xl text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-700">
                          No users found
                        </h4>
                        <p className="mt-2 text-gray-500">
                          Try adjusting your search or filter criteria
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedUserType("all");
                          }}
                          className="px-4 py-2 mt-4 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length} users
              </div>
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={users.length < ITEMS_PER_PAGE}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* User Details Modal - Keep the existing modal code */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          onClick={closeUserModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <button
                  onClick={closeUserModal}
                  className="p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left Column - Profile */}
                <div className="lg:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                     
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
                          className="flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
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
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
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
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
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
                    <div className="p-5 rounded-lg bg-gray-50">
                      <h4 className="mb-4 text-lg font-semibold text-gray-800">
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 text-blue-600 bg-blue-100 rounded-full">
                            <FaEnvelope className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{selectedUser.email}</p>
                          </div>
                        </div>

                        {selectedUser.phone && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 text-green-600 bg-green-100 rounded-full">
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
                    <div className="p-5 rounded-lg bg-gray-50">
                      <h4 className="mb-4 text-lg font-semibold text-gray-800">
                        Activity
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="p-3 bg-white border border-gray-100 rounded-lg shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 text-purple-600 bg-purple-100 rounded-full">
                              <FaBook className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bookings</p>
                              <p className="text-lg font-bold">
                                {selectedUser.totalBookings}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-white border border-gray-100 rounded-lg shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 text-yellow-600 bg-yellow-100 rounded-full">
                              <FaComment className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Reviews</p>
                              <p className="text-lg font-bold">
                                {selectedUser.totalReviews}
                              </p>
                            </div>
                          </div>
                        </div>
                        {selectedUser.role !== "traveler" &&
                          selectedUser.averageRating !== undefined && (
                            <div className="p-3 bg-white border border-gray-100 rounded-lg shadow">
                              <div className="flex items-center gap-3">
                                <div className="p-2 text-red-600 bg-red-100 rounded-full">
                                  <FaStar className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Rating
                                  </p>
                                  <p className="text-lg font-bold">
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
                      <div className="p-5 rounded-lg bg-gray-50">
                        <h4 className="mb-4 text-lg font-semibold text-gray-800">
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
