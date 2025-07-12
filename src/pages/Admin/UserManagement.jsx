import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Briefcase,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Award,
  Globe,
  Download,
  CheckCircle,
  Clock,
  X,
  Star,
  Headphones,
  Users,
  AlertTriangle,
  Paperclip,
  DollarSign,
  Package,
  Upload,
  User,
  Building,
  Coffee,
  EyeOff,
} from "lucide-react";

const UserManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGuideProfile, setShowGuideProfile] = useState(false);
  const [showEditGuide, setShowEditGuide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    active: false,
    inactive: false,
    certified: false,
  });

  const users = [
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      type: "Traveller",
      status: "Active",
      joinDate: "2024-02-20",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      contact: { email: "mike.chen@email.com", phone: "+81 90 1234 5678" },
      downloadedPackages: [
        {
          id: "D1",
          title: "Tokyo Street Food Adventure",
          location: "Tokyo, Japan",
          price: 18.99,
          rating: 4.6,
          downloads: 2340,
          duration: "3 hours",
          image:
            "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400",
          status: "Downloaded",
        },
        {
          id: "D2",
          title: "Kyoto Temple Walk",
          location: "Kyoto, Japan",
          price: 22.99,
          rating: 4.8,
          downloads: 1890,
          duration: "2.5 hours",
          image:
            "https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-temple-161401.jpeg?auto=compress&cs=tinysrgb&w=400",
          status: "Downloaded",
        },
      ],
      hiddenPlaces: [
        {
          id: "H1",
          name: "Secret Garden Café",
          location: "Shibuya, Tokyo",
          type: "Café",
          rating: 4.9,
          image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
          discoveredDate: "2024-01-15",
        },
        {
          id: "H2",
          name: "Hidden Ramen Alley",
          location: "Shinjuku, Tokyo",
          type: "Restaurant",
          rating: 4.7,
          image: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400",
          discoveredDate: "2024-02-10",
        },
      ],
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.davis@email.com",
      type: "Vendor",
      status: "Active",
      joinDate: "2024-01-08",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "London, UK",
      contact: { email: "emma.davis@email.com", phone: "+44 20 7123 4567" },
      sponsoredPlaces: [
        {
          id: "SP1",
          name: "The Crown & Anchor Pub",
          type: "Restaurant",
          location: "Covent Garden, London",
          rating: 4.5,
          image:
            "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400",
          sponsorshipType: "Premium Listing",
          monthlyFee: 299,
        },
        {
          id: "SP2",
          name: "Borough Market Café",
          type: "Café",
          location: "Borough Market, London",
          rating: 4.7,
          image:
            "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
          sponsorshipType: "Featured Placement",
          monthlyFee: 199,
        },
      ],
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      type: "Moderator",
      status: "Active",
      joinDate: "2023-12-01",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      contact: { email: "alex.rodriguez@email.com", phone: "+81 90 1234 5678" },
      region: "Europe",
      reviewedPackages: [
        {
          id: "RP1",
          title: "Barcelona Gothic Quarter Tour",
          guide: "Maria Santos",
          reviewDate: "2024-01-10",
          status: "Approved",
          rating: 4.8,
        },
        {
          id: "RP2",
          title: "Madrid Flamenco Experience",
          guide: "Carlos Mendez",
          reviewDate: "2024-01-08",
          status: "Approved",
          rating: 4.6,
        },
        {
          id: "RP3",
          title: "Seville Cathedral Audio Guide",
          guide: "Ana Lopez",
          reviewDate: "2024-01-05",
          status: "Rejected",
          rating: 3.2,
        },
      ],
    },
    {
      id: 5,
      name: "Lisa Park",
      email: "lisa.park@email.com",
      type: "Travel Guide",
      status: "Inactive",
      joinDate: "2023-11-12",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      documents: "Doc",
      contact: { email: "lisa.park@email.com", phone: "+82 10 1234 5678" },
      certification: "Pending",
      experience: "3 years",
      totalEarnings: "$8,230",
      tourPackages: [
        {
          id: "T4",
          title: "Seoul Traditional Culture Tour",
          location: "Seoul, South Korea",
          price: 26.99,
          rating: 4.6,
          downloads: 420,
          duration: "3.5 hours",
          image:
            "https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=400",
          status: "Published",
        },
      ],
    },
    {
      id: 6,
      name: "John Smith",
      email: "john.smith@email.com",
      type: "Traveller",
      status: "Active",
      joinDate: "2024-01-25",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      contact: { email: "john.smith@email.com", phone: "+1 555 123 4567" },
      downloadedPackages: [
        {
          id: "D3",
          title: "New York Central Park Tour",
          location: "New York, USA",
          price: 15.99,
          rating: 4.4,
          downloads: 3200,
          duration: "2 hours",
          image:
            "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400",
          status: "Downloaded",
        },
      ],
      hiddenPlaces: [
        {
          id: "H3",
          name: "Underground Jazz Club",
          location: "Greenwich Village, NYC",
          type: "Entertainment",
          rating: 4.8,
          image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
          discoveredDate: "2024-01-20",
        },
      ],
    },
  ];

  // Filter users based on selected filter and active filters
  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "travellers" && user.type === "Traveller") ||
      (selectedFilter === "guides" && user.type === "Travel Guide") ||
      (selectedFilter === "vendors" && user.type === "Vendor") ||
      (selectedFilter === "moderators" && user.type === "Moderator");

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply active filters
    let matchesActiveFilters = true;
    if (activeFilters.active && user.status !== "Active")
      matchesActiveFilters = false;
    if (activeFilters.inactive && user.status !== "Inactive")
      matchesActiveFilters = false;
    if (activeFilters.certified && user.certification !== "Certified")
      matchesActiveFilters = false;

    return matchesFilter && matchesSearch && matchesActiveFilters;
  });

  const getFilterCount = (filterId) => {
    if (filterId === "all") return users.length;
    if (filterId === "travellers")
      return users.filter((u) => u.type === "Traveller").length;
    if (filterId === "guides")
      return users.filter((u) => u.type === "Travel Guide").length;
    if (filterId === "vendors")
      return users.filter((u) => u.type === "Vendor").length;
    if (filterId === "moderators")
      return users.filter((u) => u.type === "Moderator").length;
    return 0;
  };

  const userTypes = [
    { id: "all", label: "All Users" },
    { id: "travellers", label: "Travellers" },
    { id: "guides", label: "Travel Guides" },
    { id: "vendors", label: "Vendors" },
    { id: "moderators", label: "Moderators" },
  ];

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type) => {
    const colors = {
      "Travel Guide": "bg-blue-100 text-blue-800",
      Traveller: "bg-purple-100 text-purple-800",
      Vendor: "bg-amber-100 text-amber-800",
      Moderator: "bg-emerald-100 text-emerald-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getCertificationColor = (certification) => {
    return certification === "Certified"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  };

  const getCertificationIcon = (certification) => {
    return certification === "Certified" ? (
      <CheckCircle className="w-3 h-3" />
    ) : (
      <Clock className="w-3 h-3" />
    );
  };

  const handleViewUser = (user) => {
    setSelectedGuide(user);
    setShowGuideProfile(true);
  };

  const handleEditUser = (user) => {
    setSelectedGuide(user);
    setShowEditGuide(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedGuide(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log("Deleting user:", selectedGuide?.name);
    setShowDeleteConfirm(false);
    setSelectedGuide(null);
  };

  const handleDeletePackage = (packageId) => {
    console.log("Deleting package:", packageId);
  };

  const getStatusBadgeColor = (status) => {
    return status === "Published"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const renderTableHeaders = () => {
    const baseHeaders = (
      <>
        <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">
          Status
        </th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">
          Contact
        </th>
      </>
    );

    let specificHeaders;
    switch (selectedFilter) {
      case "guides":
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Documents
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Certification
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Experience
            </th>
          </>
        );
        break;
      case "travellers":
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Downloaded Packages
            </th>
          </>
        );
        break;
      case "moderators":
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Region
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Reviewed Packages
            </th>
          </>
        );
        break;
      case "vendors":
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Location
            </th>
          </>
        );
        break;
      default:
        specificHeaders = null;
    }

    return (
      <>
        {baseHeaders}
        {specificHeaders}
        <th className="text-left py-3 px-4 font-medium text-gray-700">
          Joined
        </th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">
          Actions
        </th>
      </>
    );
  };

  const renderUserSpecificColumns = (user) => {
    switch (selectedFilter) {
      case "guides":
        if (user.type === "Travel Guide") {
          return (
            <>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {user.documents}
                  </a>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {getCertificationIcon(user.certification)}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationColor(
                      user.certification
                    )}`}
                  >
                    {user.certification}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-900">{user.experience}</span>
              </td>
            </>
          );
        }
        return (
          <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
            -
          </td>
        );

      case "travellers":
        if (user.type === "Traveller") {
          return (
            <td className="py-4 px-4">
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-900">
                  {user.downloadedPackages?.length || 0}
                </span>
              </div>
            </td>
          );
        }
        return <td className="py-4 px-4 text-center text-gray-500">-</td>;

      case "moderators":
        if (user.type === "Moderator") {
          return (
            <>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{user.region}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {user.reviewedPackages?.length || 0}
                  </span>
                </div>
              </td>
            </>
          );
        }
        return (
          <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
            -
          </td>
        );

      case "vendors":
        if (user.type === "Vendor") {
          return (
            <td className="py-4 px-4">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            </td>
          );
        }
        return <td className="py-4 px-4 text-center text-gray-500">-</td>;

      default:
        return null;
    }
  };

  const renderActionButtons = (user) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleViewUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="View Profile"
        >
          <Eye className="w-4 h-4 text-blue-500" />
        </button>
        <button
          onClick={() => handleEditUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Edit User"
        >
          <Edit className="w-4 h-4 text-green-500" />
        </button>
        <button
          onClick={() => handleDeleteUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Delete User"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 pl-3 ">
            User Management
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 overflow-x-auto">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedFilter(type.id)}
                className={`px-2 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  selectedFilter === type.id
                    ? "bg-teal-600 text-sm text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.label} ({getFilterCount(type.id)})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Filter Options"
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.active}
                          onChange={() => handleFilterChange("active")}
                        />
                        <span className="text-sm">Active Users</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.inactive}
                          onChange={() => handleFilterChange("inactive")}
                        />
                        <span className="text-sm">Inactive Users</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.certified}
                          onChange={() => handleFilterChange("certified")}
                        />
                        <span className="text-sm">Certified Guides</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{renderTableHeaders()}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        user.type
                      )}`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{user.contact?.phone}</span>
                      </div>
                    </div>
                  </td>
                  {renderUserSpecificColumns(user)}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{renderActionButtons(user)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredUsers.length}</span> of{" "}
            <span className="font-medium">{filteredUsers.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showGuideProfile && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] "
           style={{
              maxHeight: "90vh",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
          
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-100">
              <button
                onClick={() => setShowGuideProfile(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="flex items-start space-x-6">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={selectedGuide.avatar}
                    alt={selectedGuide.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${
                    selectedGuide.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedGuide.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedGuide.type)}`}>
                      {selectedGuide.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGuide.status)}`}>
                      {selectedGuide.status}
                    </span>
                  </div>

                  {/* Stats for Travel Guides */}
                  {selectedGuide.type === "Travel Guide" && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{selectedGuide.totalEarnings}</p>
                            <p className="text-sm text-gray-600">Total Earnings</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{selectedGuide.tourPackages?.length || 0}</p>
                            <p className="text-sm text-gray-600">Tour Packages</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{selectedGuide.experience}</p>
                            <p className="text-sm text-gray-600">Experience</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-teal-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{selectedGuide.contact?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{selectedGuide.contact?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info for Travel Guides */}
              {selectedGuide.type === "Travel Guide" && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-teal-600" />
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3">
                        {getCertificationIcon(selectedGuide.certification)}
                        <div>
                          <p className="text-sm text-gray-600">Certification Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationColor(selectedGuide.certification)}`}>
                            {selectedGuide.certification}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedGuide.documents && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Documents</p>
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                              {selectedGuide.documents}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content based on user type */}
              {selectedGuide.type === "Travel Guide" && selectedGuide.tourPackages && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-teal-600" />
                    Tour Packages ({selectedGuide.tourPackages.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedGuide.tourPackages.map((tour) => (
                      <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover" />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(tour.status)}`}>
                              {tour.status}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                            <span className="text-lg font-bold text-teal-600">${tour.price}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{tour.title}</h4>
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{tour.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-4 h-4 text-gray-400" />
                                <span>{tour.downloads}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{tour.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Traveller Content */}
              {selectedGuide.type === "Traveller" && (
                <div className="space-y-8">
                  {/* Downloaded Packages */}
                  {selectedGuide.downloadedPackages && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Download className="w-5 h-5 mr-2 text-teal-600" />
                        Downloaded Packages ({selectedGuide.downloadedPackages.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedGuide.downloadedPackages.map((tour) => (
                          <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="relative">
                              <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover" />
                              <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                                <span className="text-lg font-bold text-teal-600">${tour.price}</span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{tour.title}</h4>
                              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span>{tour.location}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{tour.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>{tour.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden Places */}
                  {selectedGuide.hiddenPlaces && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <EyeOff className="w-5 h-5 mr-2 text-teal-600" />
                        Hidden Places ({selectedGuide.hiddenPlaces.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedGuide.hiddenPlaces.map((place) => (
                          <div key={place.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="relative">
                              <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
                              <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                {place.type}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{place.name}</h4>
                              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span>{place.location}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{place.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(place.discoveredDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vendor Sponsored Places */}
              {selectedGuide.type === "Vendor" && selectedGuide.sponsoredPlaces && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-teal-600" />
                    Sponsored Places ({selectedGuide.sponsoredPlaces.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedGuide.sponsoredPlaces.map((place) => (
                      <div key={place.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
                          <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                            {place.sponsorshipType}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                            <span className="text-sm font-bold text-teal-600">${place.monthlyFee}/mo</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{place.name}</h4>
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                            <Building className="w-4 h-4" />
                            <span>{place.type}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{place.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{place.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moderator Reviewed Packages */}
              {selectedGuide.type === "Moderator" && selectedGuide.reviewedPackages && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-teal-600" />
                    Reviewed Packages ({selectedGuide.reviewedPackages.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedGuide.reviewedPackages.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">{review.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            review.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}>
                            {review.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-gray-600">Guide</p>
                              <p className="font-medium text-gray-900">{review.guide}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-gray-600">Review Date</p>
                              <p className="font-medium text-gray-900">{new Date(review.reviewDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <div>
                              <p className="text-gray-600">Rating</p>
                              <p className="font-medium text-gray-900">{review.rating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Enhanced UI */}
      {showEditGuide && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div
            className="bg-white rounded-xl max-w-xl w-full max-h-[80vh]"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="bg-teal-600 to-blue-600 p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Edit User</h2>
                </div>
                <button
                  onClick={() => setShowEditGuide(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedGuide.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedGuide.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={selectedGuide.contact?.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  {selectedGuide.type === "Travel Guide" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedGuide.experience}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Certification Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Status & Settings
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {selectedGuide.type === "Travel Guide" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Certification Status
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name="certification"
                            value="Certified"
                            defaultChecked={
                              selectedGuide.certification === "Certified"
                            }
                            className="mr-3 text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium">
                              Certified
                            </span>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name="certification"
                            value="Pending"
                            defaultChecked={
                              selectedGuide.certification === "Pending"
                            }
                            className="mr-3 text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium">
                              Pending Review
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Account Status
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          defaultChecked={selectedGuide.status === "Active"}
                          className="mr-3 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          defaultChecked={selectedGuide.status === "Inactive"}
                          className="mr-3 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-medium">Inactive</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section for Travel Guides */}
              {selectedGuide.type === "Travel Guide" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Documents
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx"
                        />
                        <button
                          type="button"
                          className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Choose Files
                        </button>
                      </div>
                    </div>

                    {/* Current Documents */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Documents
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <Paperclip className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">
                          {selectedGuide.documents}
                        </span>
                        <button
                          type="button"
                          className="ml-auto text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditGuide(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all font-medium shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete User
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedGuide.name}</strong>? This will permanently
                remove their profile and all associated data.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;