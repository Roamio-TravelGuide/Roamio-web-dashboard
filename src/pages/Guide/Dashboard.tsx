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

import { useNavigate } from 'react-router-dom';


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
    navigate('/tourCreate');
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

    const matchesStatus =
      filter === "all" || tour.status.toLowerCase() === filter.toLowerCase();

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Cards */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative p-6 overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-xl h-65 hover:shadow-xl">
            {/* Background accent */}
            <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-gradient-to-r from-teal-500 to-blue-500 opacity-10"></div>

            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="mb-1 text-lg font-medium text-gray-500">
                  Community Growth
                </p>
                <p className="text-3xl font-bold text-gray-800">2,002</p>
                <p className="mt-2 text-sm text-gray-500">Active Listeners</p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +12.5% from last month
                  </span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-r from-teal-600 to-blue-600">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Compared to LKR 295,880 last month
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
            {/* Background accent */}
            <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-gradient-to-r from-green-500 to-emerald-500 opacity-10"></div>

            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-800">
                  LKR 320,198
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Current month earnings
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center`}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      +8.2% from last month
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-r from-green-600 to-emerald-600">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Compared to LKR 295,880 last month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
            {/* Background accent */}
            <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-10"></div>

            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-500">
                  Customer Satisfaction
                </p>
                <div className="flex items-baseline mt-2">
                  <p className="text-3xl font-bold text-gray-800">4.3</p>
                  <span className="ml-1 text-sm text-gray-500">/ 5.0</span>
                </div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4.3
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center`}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      +0.2 from last month
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-r from-amber-500 to-yellow-500">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Based on 128 customer reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
            {/* Background accent */}
            <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-gradient-to-r from-purple-500 to-pink-500 opacity-10"></div>

            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-500">
                  Monthly Customers
                </p>
                <div className="flex items-baseline mt-2">
                  <p className="text-3xl font-bold text-gray-800">32</p>
                  <span className="ml-1 text-sm text-gray-500">new buyers</span>
                </div>
                <div className="w-full h-2 mt-3 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                    style={{ width: "64%" }} // Assuming 32/50 target = 64%
                  ></div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center`}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      +14% from last month
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-r from-purple-600 to-pink-600">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: 50</span>
                    <span>Progress: 64%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Table Section */}
      <div className="px-4 mx-auto mt-20 max-w-7xl sm:px-6 lg:px-8">
        <div className="p-6 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Tour Packages
            </h2>
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search tours..."
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:w-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentTours.slice(0, 6).map((tour) => (
                <div
                  key={tour.id}
                  className="overflow-hidden transition-shadow border border-gray-200 rounded-lg hover:shadow-md"
                >
                  <div className="relative">
                    <img
                      className="object-cover w-full h-48"
                      src={tour.image}
                      alt={tour.name}
                    />
                    <span
                      className={`absolute top-2 right-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        tour.status
                      )}`}
                    >
                      {tour.status.charAt(0).toUpperCase() +
                        tour.status.slice(1)}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tour.name}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {tour.destination}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(tour.price)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
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

                    <div className="flex justify-end mt-4 space-x-2">
                      <button className="p-2 text-blue-600 rounded-full hover:text-blue-800 hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 rounded-full hover:text-gray-800 hover:bg-gray-50">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 rounded-full hover:text-gray-800 hover:bg-gray-50">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No tours found matching your criteria
            </div>
          )}

          {/* Pagination controls for 6 items per page */}
          {filteredTours.length > 6 && (
            <div className="flex items-center justify-between px-6 py-4 mt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{(currentPage - 1) * 6 + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 6, filteredTours.length)}
                </span>{" "}
                of <span className="font-medium">{filteredTours.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage * 6 >= filteredTours.length}
                  className="px-4 py-2 text-sm font-medium text-white border border-gray-300 rounded-md bg-gradient-to-r from-teal-600 to-blue-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Create Tour Modal */}
      {isCreatingTour && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700">
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
                    <div className="mt-2 text-center">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                      <label className="block mb-2 text-sm font-medium text-gray-700">
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
                      <label className="block mb-2 text-sm font-medium text-gray-700">
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
                  <div className="flex flex-col md:fl                                For best results, use high-quality landscape images that
                                represent your tour. Avoid text-heavy images.ex-row gap-6">
                    {/* Image Upload Section (Left) */}
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Tour Cover Image *
                      </label>

                      <div className="relative group h-full min-h-[250px]">
                        {/* Preview/Upload Area */}
                        <label
                          className={`flex h-full rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden
          ${
            formData.coverImage
              ? "border-gray-200"
              : "border-gray-300 hover:border-blue-400 bg-gray-50"
          }`}
                        >
                          {formData.coverImage ? (
                            <div className="relative w-full h-full">
                              <img
                                src={
                                  typeof formData.coverImage === "string"
                                    ? formData.coverImage
                                    : URL.createObjectURL(formData.coverImage)
                                }
                                alt="Tour cover preview"
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/10 group-hover:opacity-100">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow bg-white/90">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                  </svg>
                                  <span className="font-medium text-blue-600">
                                    Change Image
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
                              <svg
                                className="w-12 h-12 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mb-1 text-sm text-gray-600">
                                <span className="font-medium text-blue-600">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                Recommended: 1200×800px JPG/PNG<br/>
                              </p>
                            </div>
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleInputChange("coverImage", e.target.files[0])
                            }
                            className="hidden"
                          />
                        </label>

                        {/* Remove button */}
                        {formData.coverImage && (
                          <button
                            type="button"
                            onClick={() =>
                              handleInputChange("coverImage", null)
                            }
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md backdrop-blur-sm transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description Section (Right) */}
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Tour Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe the tour highlights, itinerary, and unique experiences..."
                        rows={8}
                        className="w-full h-full min-h-[250px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between p-6 border-t border-gray-200">
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
                className="px-6 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
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
