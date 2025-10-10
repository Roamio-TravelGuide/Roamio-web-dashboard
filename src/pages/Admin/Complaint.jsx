import React, { useState, useEffect } from "react";
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaCheck, FaTimes, FaFilter } from "react-icons/fa";
import { FiChevronDown, FiChevronUp, FiClock } from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { supportAPI } from "../../api/support";

const ITEMS_PER_PAGE = 6;

const Complaints = () => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [urgencyDropdownOpen, setUrgencyDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("open");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [resolution, setResolution] = useState("");

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setStatusDropdownOpen(false);
  };

  const handleUrgencySelect = (urgency) => {
    setSelectedUrgency(urgency);
    setCurrentPage(1);
    setUrgencyDropdownOpen(false);
  };

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        status: selectedStatus === "all" ? undefined : selectedStatus,
        urgency: selectedUrgency === "all" ? undefined : selectedUrgency,
        search: searchTerm || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy: "created_at", // Add default sorting
        sortOrder: "desc",
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const response = await supportAPI.admin.getAllTickets(params);

      setComplaints(response.data?.tickets || []);
      setTotalCount(response.data?.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch complaints"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedUrgency, searchTerm, currentPage]);

  const resolveComplaint = async (id) => {
    try {
      await supportAPI.admin.updateTicketStatus(id, {
        status: "resolved",
        resolution:
          selectedComplaint?.resolutionNotes || "Complaint resolved by admin",
      });
      fetchComplaints();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error resolving complaint:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to resolve complaint";
      alert(errorMessage);
    }
  };

  // Add this function to your component
  const addSolution = async (ticketId) => {
    try {
      await supportAPI.admin.addSolutionToTicket(ticketId, {
        resolution: selectedComplaint.solution || "",
      });
      fetchComplaints();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding solution:", err);
      let errorMessage = "Failed to add solution";
      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Network error: Please check your connection or backend server.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  const rejectComplaint = async (id) => {
    try {
      await supportAPI.admin.updateTicketStatus(id, {
        status: "rejected",
        resolution:
          selectedComplaint?.resolutionNotes || "Complaint rejected by admin",
      });
      fetchComplaints();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error rejecting complaint:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to reject complaint";
      alert(errorMessage);
    }
  };

  const openComplaintModal = (complaint) => {
    setSelectedComplaint({
      ...complaint,
      title: complaint.subject,
      description: complaint.description,
      reportedUser: {
        name: complaint.user?.name || "Unknown",
        role: complaint.user_type,
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      },
      resolutionNotes: complaint.resolution || "",
    });
    setIsModalOpen(true);
  };

  const closeComplaintModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      open: "bg-yellow-50 text-yellow-700 border-yellow-200",
      in_progress: "bg-blue-50 text-blue-700 border-blue-200",
      resolved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const colorClasses = {
      low: "bg-blue-50 text-blue-700 border-blue-200",
      medium: "bg-orange-50 text-orange-700 border-orange-200",
      high: "bg-red-50 text-red-700 border-red-200",
      critical: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[urgency]}`}
      >
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return (
          <HiOutlineExclamationCircle className="text-yellow-500 text-lg" />
        );
      case "in_progress":
        return <FiClock className="text-blue-500 text-sm" />;
      case "resolved":
        return <FaCheck className="text-green-500 text-sm" />;
      case "rejected":
        return <FaTimes className="text-red-500 text-sm" />;
      default:
        return null;
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <span className="text-blue-500">🖼️</span>;
      case "video":
        return <span className="text-purple-500">🎬</span>;
      case "document":
        return <span className="text-gray-500">📄</span>;
      default:
        return <span>📁</span>;
    }
  };

  const refreshComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchComplaints();
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to refresh complaints";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} className="text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Error loading complaints
          </h3>
          <p className="mt-1 text-gray- 600">{error}</p>
          <button
            onClick={refreshComplaints}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Complaints Management
            </h1>
            <p className="text-gray-600">
              {selectedStatus === "all"
                ? "All complaints"
                : selectedStatus === "open"
                ? "Open complaints"
                : selectedStatus === "in_progress"
                ? "In progress"
                : selectedStatus === "resolved"
                ? "Resolved complaints"
                : "Rejected complaints"}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <FaFilter className="text-gray-400" />
              <span>
                Status:{" "}
                {selectedStatus === "all"
                  ? "All"
                  : selectedStatus.replace("_", " ")}
              </span>
              {statusDropdownOpen ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>

            {statusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusSelect("all")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedStatus === "all"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Complaints
                  </button>
                  <button
                    onClick={() => handleStatusSelect("open")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedStatus === "open"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <HiOutlineExclamationCircle className="mr-2 text-yellow-500" />
                    Open
                  </button>
                  <button
                    onClick={() => handleStatusSelect("in_progress")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedStatus === "in_progress"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FiClock className="mr-2 text-blue-500" />
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusSelect("resolved")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedStatus === "resolved"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaCheck className="mr-2 text-green-500 text-sm" />
                    Resolved
                  </button>
                  <button
                    onClick={() => handleStatusSelect("rejected")}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      selectedStatus === "rejected"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaTimes className="mr-2 text-red-500 text-sm" />
                    Rejected
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Urgency Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleUrgencySelect("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedUrgency === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              All Urgencies
            </button>
            <button
              onClick={() => handleUrgencySelect("critical")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedUrgency === "critical"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => handleUrgencySelect("high")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedUrgency === "high"
                  ? "bg-red-100 text-red-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              High
            </button>
            <button
              onClick={() => handleUrgencySelect("medium")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedUrgency === "medium"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => handleUrgencySelect("low")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedUrgency === "low"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                  >
                    Complaint
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                  >
                    Reported User
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 line-clamp-1">
                            {complaint.subject}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {complaint.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <img
                          className="h-6 w-6 rounded-full"
                          src="https://randomuser.me/api/portraits/lego/1.jpg"
                          alt=""
                        />
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 line-clamp-1">
                            {complaint.user?.name || "Unknown User"}
                          </div>
                          <div className="text-2xs text-gray-500">
                            {complaint.user_type || "unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="transform scale-90 origin-left">
                        {getStatusBadge(complaint.status)}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </td>
                    <td className="px-2 py-3 text-right text-xs font-medium">
                      <button
                        onClick={() => openComplaintModal(complaint)}
                        className="text-blue-600 hover:text-blue-900 text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaint Details Modal */}
        {isModalOpen && selectedComplaint && (
  <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedComplaint.title}
            </h3>
            <div className="mt-2 flex gap-2">
              {getUrgencyBadge(selectedComplaint.urgency)}
              {getStatusBadge(selectedComplaint.status)}
            </div>
          </div>
          <button
            onClick={closeComplaintModal}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <HiOutlineExclamationCircle className="text-yellow-500" />
                Complaint Description
              </h4>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedComplaint.description}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-xs ml-1 font-medium text-gray-500 uppercase tracking-wider mb-1">
                Category
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedComplaint.category}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">
                Resolution Notes
              </h4>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                placeholder="Enter your solution..."
                value={selectedComplaint.solution || ""}
                onChange={(e) => {
                  setSelectedComplaint({
                    ...selectedComplaint,
                    solution: e.target.value,
                  });
                }}
              />

              <p className="text-xs text-gray-500 mt-1">
                These notes will be saved with the complaint resolution.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">
                Report Details
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Reported User
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        selectedComplaint.reportedUser?.avatar ||
                        "https://randomuser.me/api/portraits/lego/1.jpg"
                      }
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {selectedComplaint.reportedUser?.name ||
                          "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedComplaint.reportedUser?.role ||
                          "unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Created
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <FiClock className="text-gray-400" />
                      {new Date(
                        selectedComplaint.created_at
                      ).toLocaleString()}
                    </div>
                  </div>
                  {selectedComplaint.updated_at && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Last Updated
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <FiClock className="text-gray-400" />
                        {new Date(
                          selectedComplaint.updated_at
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(selectedComplaint.status === "open" || selectedComplaint.status === "in_progress") && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">
                  Resolution Actions
                </h4>
                <button
                  onClick={() => addSolution(selectedComplaint.id)}
                  disabled={!selectedComplaint.solution?.trim()}
                  className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors ${
                    selectedComplaint.solution?.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheck />
                  {selectedComplaint.status === "in_progress" ? "Mark as Resolved" : "Submit Solution"}
                </button>
                <button
                  onClick={() => rejectComplaint(selectedComplaint.id)}
                  className="w-full bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 flex items-center justify-center gap-2 transition-colors border border-red-200"
                >
                  <FaTimes />
                  {selectedComplaint.status === "in_progress" ? "Cancel Resolution" : "Reject Complaint"}
                </button>
              </div>
            )}

            {selectedComplaint.status === "resolved" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <FiCheckCircle className="w-5 h-5" />
                  <h4 className="font-semibold text-lg">Resolved</h4>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  This complaint was resolved on {new Date(selectedComplaint.resolved_at).toLocaleString()}
                </p>
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
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
            </div>
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border-t border-b border-gray-300 ${
                      currentPage === page
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Show empty state if no complaints found */}
        {complaints.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto max-w-md">
              <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-lg font-medium text-gray-700">
                No complaints found
              </h4>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("open");
                  setSelectedUrgency("all");
                  setCurrentPage(1);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;