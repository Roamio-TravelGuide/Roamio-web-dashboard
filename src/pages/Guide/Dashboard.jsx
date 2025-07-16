import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  CheckCircle, 
  Edit, 
  TrendingUp,
  Shield, 
  Search,
  XCircle, 
  ChevronDown,
  DollarSign,
  Clock,
  Users,
  Eye,
  Heart,
  Share,
  Headphones,
  Image,
  Video,
  Calendar,
  Download,
  Settings,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const GuideDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({
    performance: {},
    tours: [],
    engagement: {},
    financials: {}
  });

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'ytd', label: 'Year to Date' }
  ];

  // Sample data - replace with API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStats({
        performance: {
          avgRating: 4.7,
          ratingChange: '+0.2',
          completionRate: 92,
          completionChange: '+3%',
          avgDuration: 42,
          durationChange: '-2min'
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
            media: {
              audio: 12,
              images: 24,
              videos: 3
            },
            created_at: '2024-01-15',
            cover_image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400'
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
            media: {
              audio: 8,
              images: 15,
              videos: 2
            },
            created_at: '2024-01-10',
            cover_image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400'
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
            media: {
              audio: 6,
              images: 12,
              videos: 0
            },
            created_at: '2024-01-20',
            cover_image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        ],
        engagement: {
          totalVisitors: 1432,
          newVisitors: 1024,
          returningVisitors: 408,
          favoriteTours: 287,
          shares: 156,
          avgSessionDuration: '12:45'
        },
        financials: {
          totalRevenue: 5820.50,
          monthlyRevenue: 1820.25,
          avgRevenuePerTour: 485.04,
          projectedRevenue: 7240.00,
          conversionRate: 12.4
        }
      });

      setIsLoading(false);
    };

    fetchData();
  }, [timeRange]);

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
        return { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Published' };
      case 'pending_approval':
        return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Review' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', label: status };
    }
  };

  const renderTrendIndicator = (value) => {
    const isPositive = value.includes('+');
    const isNeutral = value === '0%';
    
    if (isNeutral) {
      return (
        <span className="text-xs font-medium text-slate-500">
          {value}
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center text-xs font-medium ${
        isPositive ? 'text-teal-600' : 'text-red-600'
      }`}>
        {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
        {value}
      </span>
    );
  };

  // Calculate totals for each media type
  const getTotalMediaCounts = () => {
    const totals = stats.tours.reduce((acc, tour) => {
      acc.audio += tour.media.audio;
      acc.images += tour.media.images;
      acc.videos += tour.media.videos;
      return acc;
    }, { audio: 0, images: 0, videos: 0 });

    const total = totals.audio + totals.images + totals.videos;
    
    return {
      audio: { count: totals.audio, percentage: total > 0 ? (totals.audio / total) * 100 : 0 },
      images: { count: totals.images, percentage: total > 0 ? (totals.images / total) * 100 : 0 },
      videos: { count: totals.videos, percentage: total > 0 ? (totals.videos / total) * 100 : 0 }
    };
  };

  const CircularProgress = ({ percentage, count, label, color, icon: Icon }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={color}
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
              style={{
                transition: 'stroke-dasharray 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-slate-800">{count}</div>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon className="w-4 h-4 mr-2 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
          <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header - Exact match to TourPackages */}
      <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-col max-w-2xl gap-2">
              <span className="text-sm font-medium tracking-wide text-teal-400">ANALYTICS OVERVIEW</span>
              <h1 className="text-3xl font-light leading-tight text-white">Guide Dashboard</h1>
              <p className="text-slate-300">Track your tour performance and engagement metrics with detailed insights</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center px-4 py-2 text-white transition-all duration-300 border rounded-lg border-slate-600 hover:bg-slate-800">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 text-white transition-all duration-300 border rounded-lg border-slate-600 hover:bg-slate-800">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-white"
                >
                  {timeRangeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hero Stats Section - Horizontal Layout */}
              <div className="relative overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 opacity-50"></div>
                <div className="relative p-4">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
                        <Star className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="text-3xl font-bold text-slate-800">{stats.performance.avgRating}</div>
                      <div className="text-sm text-slate-600">Average Rating</div>
                      <div className="mt-1">{renderTrendIndicator(stats.performance.ratingChange)}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full">
                        <CheckCircle className="w-8 h-8 text-teal-600" />
                      </div>
                      <div className="text-3xl font-bold text-slate-800">{stats.performance.completionRate}%</div>
                      <div className="text-sm text-slate-600">Completion Rate</div>
                      <div className="mt-1">{renderTrendIndicator(stats.performance.completionChange)}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                        <Clock className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-slate-800">{stats.performance.avgDuration}m</div>
                      <div className="text-sm text-slate-600">Average Duration</div>
                      <div className="mt-1">{renderTrendIndicator(stats.performance.durationChange)}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                        <MapPin className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-slate-800">{stats.tours.length}</div>
                      <div className="text-sm text-slate-600">Active Tours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue & Performance Split Layout */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Revenue Sidebar */}
                <div className="space-y-6">
                  {/* Total Revenue Card */}
                  <div className="relative overflow-hidden bg-white shadow-sm rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50"></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Total Revenue</h3>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-2">
                        {formatCurrency(stats.financials.totalRevenue)}
                      </div>
                      <div className="text-sm text-slate-600">
                        Monthly: {formatCurrency(stats.financials.monthlyRevenue)}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white shadow-sm rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Conversion Rate</span>
                        <span className="font-semibold text-slate-800">{stats.financials.conversionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Avg Revenue/Tour</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(stats.financials.avgRevenuePerTour)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Visitors</span>
                        <span className="font-semibold text-slate-800">{stats.engagement.totalVisitors.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tour Performance Table */}
                  <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">Tour Performance</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100">
                          <Eye className="w-4 h-4" />
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Tour</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Bookings</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Revenue</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                          {stats.tours.map((tour) => (
                            <tr key={tour.id} className="transition-colors hover:bg-slate-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden rounded-xl">
                                    <img 
                                      className="object-cover w-full h-full" 
                                      src={tour.cover_image} 
                                      alt={tour.title} 
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-slate-800">{tour.title}</div>
                                    <div className="flex items-center mt-1 text-xs text-slate-500">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {tour.stops} stops
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(tour.status).bg} ${getStatusBadge(tour.status).text}`}>
                                  {getStatusBadge(tour.status).label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap">
                                <div className="flex items-center justify-end">
                                  <span className="text-slate-800">{tour.bookings}</span>
                                  <span className="ml-2">{renderTrendIndicator(tour.bookingTrend)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap">
                                <div className="flex items-center justify-end">
                                  <span className="text-slate-800">{formatCurrency(tour.revenue)}</span>
                                  <span className="ml-2">{renderTrendIndicator(tour.revenueTrend)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap">
                                {tour.rating ? (
                                  <div className="flex items-center justify-end">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                    <span className="text-slate-800">{tour.rating}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Content & Engagement */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Content Analysis - Three Separate Rings */}
                <div className="bg-white shadow-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-15">Content Distribution</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <CircularProgress 
                      {...getTotalMediaCounts().audio}
                      label="Audio Clips"
                      color="text-blue-500"
                      icon={Headphones}
                    />
                    <CircularProgress 
                      {...getTotalMediaCounts().images}
                      label="Images"
                      color="text-teal-500"
                      icon={Image}
                    />
                    <CircularProgress 
                      {...getTotalMediaCounts().videos}
                      label="Videos"
                      color="text-purple-500"
                      icon={Video}
                    />
                  </div>
                </div>

                {/* Engagement Metrics - Circular Progress */}
                <div className="bg-white shadow-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">Engagement Overview</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-slate-100"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-teal-500"
                          strokeWidth="8"
                          strokeDasharray={`${stats.performance.completionRate * 2.51}, 251`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          style={{
                            transition: 'stroke-dasharray 1s ease-in-out'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-slate-800">{stats.performance.completionRate}%</div>
                        <div className="text-xs text-slate-500">Completion</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-slate-800">{stats.engagement.favoriteTours}</div>
                      <div className="text-xs text-slate-600">Favorites</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-slate-800">{stats.engagement.shares}</div>
                      <div className="text-xs text-slate-600">Shares</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-slate-800">{stats.engagement.newVisitors}</div>
                      <div className="text-xs text-slate-600">New Visitors</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-slate-800">{stats.engagement.avgSessionDuration}</div>
                      <div className="text-xs text-slate-600">Avg Session</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;