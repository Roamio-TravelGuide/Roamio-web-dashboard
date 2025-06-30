import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Award,
  Users as UsersIcon,
} from "lucide-react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "banned" | "blocked" | "pending";
  role: string;
  avatar: string;
  registeredDate: string;
  lastLogin?: string;
  bio?: string;
  address?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  totalBookings?: number;
  totalReviews?: number;
  averageRating?: number;
  poisCount?: number;
}

const ITEMS_PER_PAGE = 6;
const API_BASE_URL = "http://localhost:3001/api/v1";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: {
            role: "vendor", // Only fetch vendors
            search: searchTerm,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        const transformedUsers = response.data.data.map((user: any) => ({
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
          address: user.address,
          businessName: user.business_name,
          businessAddress: user.business_address,
          businessType: user.business_type,
          totalBookings: user.traveler_count || 0,
          totalReviews: user.report_count || 0,
          averageRating: 0,
          poisCount: user.pois_count || 0,
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
  }, [searchTerm, currentPage]);

  const getStatusBadge = (status: string) => {
    const colorClasses = {
      active: "bg-green-100 text-green-800",
      banned: "bg-red-100 text-red-800",
      blocked: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          colorClasses[status as keyof typeof colorClasses] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const openProfileModal = async (user: User) => {
    try {
      setIsLoading(true);
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        address: user.address,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessType: user.businessType,
      });
      setIsProfileModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setIsLoading(true);

      // Use the correct endpoint - adjust this to match your backend
      const response = await axios.patch(
        `${API_BASE_URL}/vendors/${selectedUser.id}`,
        {
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            address: formData.address,
          },
          business: {
            name: formData.businessName,
            address: formData.businessAddress,
            type: formData.businessType,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if needed
          },
        }
      );

      // Update UI state
      const updatedData = response.data;
      setUsers(users.map((u) => (u.id === selectedUser.id ? updatedData : u)));
      setSelectedUser(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const toggleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = selectedUser.status === "active" ? "blocked" : "active";

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

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Vendors</h3>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
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
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-avatar.png";
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{user.name}</h4>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <div className="mt-1">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                            {user.role.replace("_", " ")}
                          </span>
                          <span className="ml-2">
                            {getStatusBadge(user.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Joined:{" "}
                        {new Date(user.registeredDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => openProfileModal(user)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Business
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                <h4 className="text-lg font-medium text-gray-700">
                  No vendors found
                </h4>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">
                  {selectedUser.name}'s Details
                </h3>
                <button
                  onClick={closeUserModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/default-avatar.png";
                    }}
                  />
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={toggleBlockUser}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedUser.status === "active"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {selectedUser.status === "active"
                        ? "Block User"
                        : "Unblock User"}
                    </button>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Basic Information
                      </h4>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="text-gray-500">Name:</span>{" "}
                          {selectedUser.name}
                        </p>
                        <p>
                          <span className="text-gray-500">Email:</span>{" "}
                          {selectedUser.email}
                        </p>
                        {selectedUser.phone && (
                          <p>
                            <span className="text-gray-500">Phone:</span>{" "}
                            {selectedUser.phone}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-500">Role:</span>{" "}
                          <span className="capitalize">
                            {selectedUser.role.replace("_", " ")}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">Status:</span>{" "}
                          {getStatusBadge(selectedUser.status)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700">Activity</h4>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="text-gray-500">Joined:</span>{" "}
                          {new Date(
                            selectedUser.registeredDate
                          ).toLocaleDateString()}
                        </p>
                        {selectedUser.lastLogin && (
                          <p>
                            <span className="text-gray-500">Last Login:</span>{" "}
                            {new Date(selectedUser.lastLogin).toLocaleString()}
                          </p>
                        )}
                        {selectedUser.totalBookings !== undefined && (
                          <p>
                            <span className="text-gray-500">
                              Total Bookings:
                            </span>{" "}
                            {selectedUser.totalBookings}
                          </p>
                        )}
                        {selectedUser.totalReviews !== undefined && (
                          <p>
                            <span className="text-gray-500">
                              Total Reviews:
                            </span>{" "}
                            {selectedUser.totalReviews}
                          </p>
                        )}
                        {selectedUser.averageRating !== undefined && (
                          <p>
                            <span className="text-gray-500">
                              Average Rating:
                            </span>{" "}
                            {selectedUser.averageRating}/5
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700">Bio</h4>
                      <p className="mt-1 text-gray-600">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Profile Modal */}
      {isProfileModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">
                  {isEditing
                    ? "Edit Business Profile"
                    : `${selectedUser.name}'s Business`}
                </h3>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select type</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="RESTAURANT">Restaurant</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="ATTRACTION">Attraction</option>
                        <option value="SHOP">Shop</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Business Address
                    </label>
                    <input
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">About</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-4xl font-bold">
                        {selectedUser.businessName?.charAt(0) || "B"}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {selectedUser.businessName || "Business Name"}
                          </h4>
                          <p className="text-gray-600">
                            {selectedUser.businessType
                              ?.toLowerCase()
                              .replace("_", " ") ||
                              "Business type not specified"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">City Center</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                            <UsersIcon className="w-4 h-4" />
                            <span className="text-sm">100+ Customers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-gray-700">
                            Address
                          </h5>
                          <p className="text-gray-600">
                            {selectedUser.businessAddress || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <h5 className="font-semibold text-gray-700">Phone</h5>
                          <p className="text-gray-600">
                            {selectedUser.phone || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <h5 className="font-semibold text-gray-700">Email</h5>
                          <p className="text-gray-600">{selectedUser.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <h5 className="font-semibold text-gray-700">
                            Active Since
                          </h5>
                          <p className="text-gray-600">
                            {new Date(
                              selectedUser.registeredDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        About
                      </h4>
                      <p className="text-gray-600">{selectedUser.bio}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-700">
                          Points of Interest
                        </h4>
                        <p className="text-gray-600">
                          {selectedUser.poisCount || 0} listed locations
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(4.5)}
                        <span className="text-gray-700 font-medium ml-1">
                          4.5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
