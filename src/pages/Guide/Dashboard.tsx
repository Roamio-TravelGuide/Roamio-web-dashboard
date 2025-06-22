import React, { useState } from "react";
import {
  FaPlus,
  FaUsers,
  FaMoneyCheck,
  FaRegStar,
  FaCalendar,
} from "react-icons/fa";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  MoreHorizontal,
  Users,
  Star,
  MapPin,
} from "lucide-react";

interface Tour {
  id: string;
  name: string;
  destination: string;
  price: number;
  status: "draft" | "published" | "archived";
  rating: number;
  totalRatings: number;
  listeners: number;
  revenue: number;
  lastUpdated: string;
  image: string;
}

interface CreateTourForm {
  name: string;
  start: string;
  price: string;
  duration: string;
  description: string;
}

function Dashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingTour, setIsCreatingTour] = useState(false);

  const [formData, setFormData] = useState<CreateTourForm>({
    name: "",
    start: "",
    price: "",
    duration: "",
    description: "",
  });

  const tours: Tour[] = [
    {
      id: "1",
      name: "Galle Heritage Walk",
      destination: "Galle",
      price: 4999,
      status: "published",
      rating: 4.8,
      totalRatings: 124,
      listeners: 856,
      revenue: 427440,
      lastUpdated: "2024-01-15",
      image:
        "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      name: "Colombo City Explorer",
      destination: "Colombo",
      price: 3500,
      status: "published",
      rating: 4.5,
      totalRatings: 89,
      listeners: 642,
      revenue: 224700,
      lastUpdated: "2024-01-12",
      image:
        "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "3",
      name: "Matara Beach Paradise",
      destination: "Matara",
      price: 5500,
      status: "draft",
      rating: 0,
      totalRatings: 0,
      listeners: 0,
      revenue: 0,
      lastUpdated: "2024-01-10",
      image:
        "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "4",
      name: "Ratnapura Gem Trail",
      destination: "Ratnapura",
      price: 6200,
      status: "published",
      rating: 4.9,
      totalRatings: 67,
      listeners: 534,
      revenue: 331080,
      lastUpdated: "2024-01-08",
      image:
        "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "5",
      name: "Kandy Cultural Experience",
      destination: "Kandy",
      price: 4800,
      status: "published",
      rating: 4.7,
      totalRatings: 112,
      listeners: 789,
      revenue: 378720,
      lastUpdated: "2024-01-18",
      image:
        "https://images.pexels.com/photos/3025490/pexels-photo-3025490.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "6",
      name: "Sigiriya Rock Adventure",
      destination: "Sigiriya",
      price: 7500,
      status: "published",
      rating: 4.9,
      totalRatings: 145,
      listeners: 923,
      revenue: 692250,
      lastUpdated: "2024-01-20",
      image:
        "https://images.pexels.com/photos/3290068/pexels-photo-3290068.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "7",
      name: "Nuwara Eliya Tea Tour",
      destination: "Nuwara Eliya",
      price: 5200,
      status: "published",
      rating: 4.6,
      totalRatings: 78,
      listeners: 567,
      revenue: 294840,
      lastUpdated: "2024-01-14",
      image:
        "https://images.pexels.com/photos/634038/pexels-photo-634038.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "8",
      name: "Anuradhapura Ancient City",
      destination: "Anuradhapura",
      price: 5800,
      status: "draft",
      rating: 0,
      totalRatings: 0,
      listeners: 0,
      revenue: 0,
      lastUpdated: "2024-01-05",
      image:
        "https://images.pexels.com/photos/3581363/pexels-photo-3581363.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "9",
      name: "Yala Safari Expedition",
      destination: "Yala",
      price: 8900,
      status: "published",
      rating: 4.9,
      totalRatings: 203,
      listeners: 1245,
      revenue: 1108050,
      lastUpdated: "2024-01-22",
      image:
        "https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "10",
      name: "Trinco Beach Getaway",
      destination: "Trincomalee",
      price: 6700,
      status: "published",
      rating: 4.7,
      totalRatings: 56,
      listeners: 432,
      revenue: 289440,
      lastUpdated: "2024-01-17",
      image:
        "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "11",
      name: "Ella Nature Trek",
      destination: "Ella",
      price: 4500,
      status: "archived",
      rating: 4.8,
      totalRatings: 98,
      listeners: 654,
      revenue: 294300,
      lastUpdated: "2023-12-15",
      image:
        "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "12",
      name: "Polonnaruwa Ruins Tour",
      destination: "Polonnaruwa",
      price: 5100,
      status: "published",
      rating: 4.5,
      totalRatings: 43,
      listeners: 321,
      revenue: 163710,
      lastUpdated: "2024-01-09",
      image:
        "https://images.pexels.com/photos/3581367/pexels-photo-3581367.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "13",
      name: "Bentota Water Sports",
      destination: "Bentota",
      price: 7300,
      status: "published",
      rating: 4.6,
      totalRatings: 87,
      listeners: 543,
      revenue: 396390,
      lastUpdated: "2024-01-19",
      image:
        "https://images.pexels.com/photos/1139040/pexels-photo-1139040.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "14",
      name: "Dambulla Cave Temple",
      destination: "Dambulla",
      price: 4200,
      status: "draft",
      rating: 0,
      totalRatings: 0,
      listeners: 0,
      revenue: 0,
      lastUpdated: "2024-01-07",
      image:
        "https://images.pexels.com/photos/3581365/pexels-photo-3581365.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "15",
      name: "Mirissa Whale Watching",
      destination: "Mirissa",
      price: 6800,
      status: "published",
      rating: 4.9,
      totalRatings: 134,
      listeners: 876,
      revenue: 595680,
      lastUpdated: "2024-01-21",
      image:
        "https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const createTourSteps = [
    {
      title: "Basic Information",
      description: "Tour name and start details",
    },
    {
      title: "Description",
      description: "Tour description and highlights",
    },
    {
      title: "Pricing & Details",
      description: "Price, transport, and duration",
    },
  ];

  const handleInputChange = (field: keyof CreateTourForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < createTourSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateTour = () => {
    console.log("Creating tour", formData);
    setIsCreatingTour(false);
    setCurrentStep(1);
    setFormData({
      name: "",
      start: "",
      price: "",
      duration: "",
      description: "",
    });
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      search === "" ||
      tour.name.toLowerCase().includes(search.toLowerCase()) ||
      tour.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filter === "all" || tour.status === filter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

const [currentPage, setCurrentPage] = useState(1);
const toursPerPage = 6; // Changed from 10 to 6

// Get current tours
const indexOfLastTour = currentPage * toursPerPage;
const indexOfFirstTour = indexOfLastTour - toursPerPage;
const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
                Guide Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your tours and track performance
              </p>
            </div>
            <button
              onClick={() => setIsCreatingTour(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              Create New Tour
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-5 relative h-30">
            <div className="flex flex-col justify-between">
              <p className="text-xl">Total Listeners</p>
              <p className="text-xl font-bold mt-5">2002</p>
            </div>
            <div className="absolute bottom-10 right-5 bg-gradient-to-r from-teal-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <FaUsers className="text-xl text-white" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5 relative h-30">
            <div className="flex flex-col justify-between">
              <p className="text-xl">Total Revenue</p>
              <p className="text-xl font-bold mt-5">LKR 320198</p>
            </div>
            <div className="absolute bottom-10 right-5 bg-gradient-to-r from-teal-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <FaMoneyCheck className="text-xl text-white" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5 relative h-30">
            <div className="flex flex-col justify-between">
              <p className="text-xl">Average Ratings</p>
              <p className="text-xl font-bold mt-5">4.3</p>
            </div>
            <div className="absolute bottom-10 right-5 bg-gradient-to-r from-teal-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <FaRegStar className="text-xl text-white" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5 relative h-30">
            <div className="flex flex-col justify-between">
              <p className="text-xl">Current Month Buyers</p>
              <p className="text-xl font-bold mt-5">32</p>
            </div>
            <div className="absolute bottom-10 right-5 bg-gradient-to-r from-teal-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <FaCalendar className="text-xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tours Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
  <div className="bg-white shadow rounded-lg overflow-hidden p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Tour Packages</h2>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search tours..."
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    {/* Card Grid Layout - 6 per page */}
    {filteredTours.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTours.slice(0, 6).map((tour) => (
          <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={tour.image}
                alt={tour.name}
              />
              <span
                className={`absolute top-2 right-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  tour.status
                )}`}
              >
                {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              </span>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {tour.destination}
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(tour.price)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{tour.listeners} listeners</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>
                    {tour.rating > 0
                      ? `${tour.rating} (${tour.totalRatings})`
                      : "No ratings"}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Revenue: {formatCurrency(tour.revenue)}</span>
                    <span>Updated: {tour.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-10 text-gray-500">
        No tours found matching your criteria
      </div>
    )}

    {/* Pagination controls for 6 items per page */}
    {filteredTours.length > 6 && (
      <div className="mt-6 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * 6 + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * 6, filteredTours.length)}
          </span>{' '}
          of <span className="font-medium">{filteredTours.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * 6 >= filteredTours.length}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
</div>{/* Create Tour Modal */}
      {isCreatingTour && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
                  Create New Tour
                </h2>
                <button
                  onClick={() => setIsCreatingTour(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-between mt-6">
                {createTourSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep > index + 1
                          ? "bg-green-500 text-white"
                          : currentStep === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > index + 1 ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tour Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Galle Heritage Walk"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start *
                    </label>
                    <input
                      type="text"
                      value={formData.start}
                      onChange={(e) =>
                        handleInputChange("start", e.target.value)
                      }
                      placeholder="e.g., Galle, Sri Lanka"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (LKR) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="4999"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        placeholder="e.g., 4 hours"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tour Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe your tour..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              <button
                onClick={
                  currentStep === createTourSteps.length
                    ? handleCreateTour
                    : nextStep
                }
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
              >
                {currentStep === createTourSteps.length
                  ? "Create Tour"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
