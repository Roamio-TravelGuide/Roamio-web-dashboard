import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMap, 
  FiUsers, 
  FiDollarSign, 
  FiStar, 
  FiCalendar,
  FiBarChart2,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
  FiPlus,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiEdit,
  FiMoreHorizontal
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({
    totalTours: 0,
    publishedTours: 0,
    pendingTours: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
    averageRating: 0,
    performance: {},
    tours: [],
    engagement: {},
    financials: {},
    reviews: [],
    recentActivities: []
  });

  // Mock data - replace with API calls
  useEffect(() => {
    setStats({
      totalTours: 15,
      publishedTours: 12,
      pendingTours: 2,
      totalEarnings: 25489.50,
      upcomingBookings: 5,
      averageRating: 4.7,
      performance: {
        avgRating: 4.7,
        ratingChange: '+0.2',
        completionRate: 92,
        completionChange: '+3%',
        avgDuration: 42,
        durationChange: '-2min',
        monthlyGoal: 30000,
        rejectedTours: 1,
        yearsExperience: 5,
        languages: ['English', 'Sinhala', 'Tamil']
      },
      tours: [
        {
          id: 1,
          title: "Sigiriya Rock Fortress",
          status: "published",
          bookings: 87,
          bookingTrend: '12%',
          revenue: 3520,
          revenueTrend: '18%',
          rating: 4.8,
          stops: 8,
          type: "Historical",
          priority: "High",
          chart: "up",
          duration: 240,
          createdAt: '2024-01-15',
          lastUpdated: '2024-03-10',
          downloads: 124
        },
        {
          id: 2,
          title: "Kandy Temple Walk",
          status: "published",
          bookings: 42,
          bookingTrend: '5%',
          revenue: 1250,
          revenueTrend: '8%',
          rating: 4.6,
          stops: 5,
          type: "Cultural",
          priority: "Medium",
          chart: "up",
          duration: 180,
          createdAt: '2024-02-05',
          lastUpdated: '2024-03-15',
          downloads: 87
        },
        {
          id: 3,
          title: "Colombo City Explorer",
          status: "pending_approval",
          bookings: 0,
          bookingTrend: '0%',
          revenue: 0,
          revenueTrend: '0%',
          rating: null,
          stops: 6,
          type: "Urban",
          priority: "Low",
          chart: "flat",
          duration: 210,
          createdAt: '2024-03-01',
          lastUpdated: '2024-03-01',
          downloads: 0
        }
      ],
      engagement: {
        totalVisitors: 1432,
        newVisitors: 1024,
        returningVisitors: 408,
        favoriteTours: 287,
        shares: 156,
        avgSessionDuration: '12:45',
        totalDownloads: 459,
        mediaUploads: 32
      },
      financials: {
        totalRevenue: 5820.50,
        monthlyRevenue: 1820.25,
        avgRevenuePerTour: 485.04,
        projectedRevenue: 7240.00,
        conversionRate: 12.4,
        pendingPayments: 420.50,
        completedPayments: 5399.00
      },
      reviews: [
        {
          id: 1,
          traveler: "Sarah Johnson",
          rating: 5,
          comment: "Amazing tour! Our guide was incredibly knowledgeable about Sigiriya's history.",
          date: '2024-03-12',
          tourId: 1
        },
        {
          id: 2,
          traveler: "Michael Chen",
          rating: 4,
          comment: "Good experience, but the tour ran a bit longer than expected.",
          date: '2024-03-08',
          tourId: 2
        }
      ],
      recentActivities: [
        {
          id: 1,
          type: "package_publish",
          title: "Tour Published",
          description: "Your tour 'Sigiriya Rock Fortress' was published",
          date: '2024-03-10T14:30:00Z'
        },
        {
          id: 2,
          type: "review_post",
          title: "New Review",
          description: "Sarah Johnson left a 5-star review for your tour",
          date: '2024-03-12T09:15:00Z'
        },
        {
          id: 3,
          type: "payment_success",
          title: "Payment Received",
          description: "Received LKR 12,500 for bookings",
          date: '2024-03-11T16:45:00Z'
        }
      ]
    });
  }, [timeRange]);

  // Chart data
  const bookingData = [
    { name: 'Jan', bookings: 35, revenue: 1200 },
    { name: 'Feb', bookings: 42, revenue: 1500 },
    { name: 'Mar', bookings: 58, revenue: 2100 },
    { name: 'Apr', bookings: 45, revenue: 1800 },
    { name: 'May', bookings: 62, revenue: 2400 },
    { name: 'Jun', bookings: 75, revenue: 2900 }
  ];

  const tourTypeData = [
    { name: 'Historical', value: 45 },
    { name: 'Cultural', value: 25 },
    { name: 'Nature', value: 20 },
    { name: 'Urban', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' };
      case 'pending_approval':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTrendIndicator = (value) => {
    const isPositive = value.includes('+');
    const isNeutral = value === '0%';
    
    if (isNeutral) {
      return <span className="text-xs font-medium text-gray-500">{value}</span>;
    }
    
    return (
      <span className={`inline-flex items-center text-xs font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? '↑' : '↓'} {value}
      </span>
    );
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FiStar key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <FiStar key="half" className="w-4 h-4 text-yellow-400 fill-current" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">{rating?.toFixed(1)}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'tours':
        return <div>Tours Management</div>;
      case 'support':
        return <div>Support</div>;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col justify-between pb-6 md:flex-row md:items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Guide Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your performance overview.</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div className="relative">
                  <select 
                    className="py-2 pl-3 pr-8 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="ytd">Year to Date</option>
                  </select>
                </div>
                <Link
                  to="/guide/tourcreate"
                  className="flex items-center px-5 py-2 text-sm text-white transition-all duration-300 bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  <FiPlus className="mr-2" />
                  New Tour
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <h3 className="mt-1 text-2xl font-semibold text-gray-800">{formatCurrency(stats.totalEarnings)}</h3>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="p-3 rounded-lg text-amber-600 bg-amber-100">
                    <FiDollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <div className="flex items-center mt-1">
                      <RatingStars rating={stats.averageRating} />
                      <span className="ml-2 text-sm text-green-600">{stats.performance.ratingChange}</span>
                    </div>
                    <p className="text-sm text-gray-500">From {stats.reviews.length} reviews</p>
                  </div>
                  <div className="p-3 text-purple-600 bg-purple-100 rounded-lg">
                    <FiStar className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                    <h3 className="mt-1 text-2xl font-semibold text-gray-800">{stats.performance.completionRate}%</h3>
                    <p className="text-sm text-green-600">{stats.performance.completionChange}</p>
                  </div>
                  <div className="p-3 text-green-600 bg-green-100 rounded-lg">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                    <h3 className="mt-1 text-2xl font-semibold text-gray-800">{stats.engagement.totalDownloads}</h3>
                    <p className="text-sm text-green-600">+8% from last month</p>
                  </div>
                  <div className="p-3 text-blue-600 bg-blue-100 rounded-lg">
                    <FiDownload className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bookings & Revenue Chart */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Bookings & Revenue</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bookingData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Revenue (USD)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bookings"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Bookings"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tour Types Distribution */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Tour Types Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tourTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tourTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Tours & Activities */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Tours */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Tours</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm font-medium text-left text-gray-600 border-b">
                        <th className="pb-3">Tour Name</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Bookings</th>
                        <th className="pb-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {stats.tours.slice(0, 3).map((tour) => {
                        const statusBadge = getStatusBadge(tour.status);
                        return (
                          <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4">
                              <div className="font-medium text-gray-800">{tour.title}</div>
                              <div className="text-xs text-gray-500">{tour.type}</div>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.label}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{tour.bookings}</span>
                                {renderTrendIndicator(tour.bookingTrend)}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{formatCurrency(tour.revenue)}</span>
                                {renderTrendIndicator(tour.revenueTrend)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <div className="space-y-4">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                      <div className="p-2 mt-1 rounded-full bg-gray-50">
                        {activity.type === 'package_publish' && <FiCheckCircle className="w-5 h-5 text-green-500" />}
                        {activity.type === 'review_post' && <FiStar className="w-5 h-5 text-yellow-500" />}
                        {activity.type === 'payment_success' && <FiDollarSign className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{activity.title}</div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 px-4 py-8 bg-white shadow-md md:block">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-indigo-700">TourGuide Pro</h2>
          <p className="text-sm text-gray-500">Guide Dashboard</p>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiBarChart2 className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'tours' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiMap className="w-5 h-5 mr-3" />
            My Tours
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'bookings' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiCalendar className="w-5 h-5 mr-3" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiTrendingUp className="w-5 h-5 mr-3" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'support' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiHelpCircle className="w-5 h-5 mr-3" />
            Support
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
          <button className="p-2 text-gray-500 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="w-6"></div>
        </div>

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default GuideDashboard;