import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Users, Star, DollarSign, TrendingUp, 
  BarChart2, FileText, ChevronDown, Loader2, Calendar,
  Award, Heart, Repeat, Headphones, Image as ImageIcon , CheckCircle , Share2 , Video
} from 'lucide-react';

const GuideDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({
    performance: {},
    tours: [],
    engagement: {},
    financials: {}
  });

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
            }
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
            }
          },
          {
            id: 3,
            title: "Colombo City Explorer",
            status: "pending",
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
            }
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

  const renderTrendIndicator = (value) => {
    const isPositive = value.includes('+');
    return (
      <span className={`inline-flex items-center ml-2 text-xs font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {value}
        <ChevronDown className={`w-3 h-3 ml-0.5 ${
          isPositive ? 'text-green-600 rotate-180' : 'text-red-600'
        }`} />
      </span>
    );
  };

  const renderMetricCard = (title, value, change, icon, color) => (
    <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-end mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && renderTrendIndicator(change)}
          </div>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Time Range Selector */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          {['7d', '30d', '90d', 'ytd'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${range === '7d' ? 'rounded-l-lg' : ''} ${
                range === 'ytd' ? 'rounded-r-lg' : 'border-r border-gray-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {renderMetricCard(
              'Avg. Rating',
              stats.performance.avgRating,
              stats.performance.ratingChange,
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
              'bg-yellow-50'
            )}
            {renderMetricCard(
              'Completion Rate',
              `${stats.performance.completionRate}%`,
              stats.performance.completionChange,
              <CheckCircle className="w-5 h-5 text-green-500" />,
              'bg-green-50'
            )}
            {renderMetricCard(
              'Avg. Duration',
              `${stats.performance.avgDuration} min`,
              stats.performance.durationChange,
              <Clock className="w-5 h-5 text-blue-500" />,
              'bg-blue-50'
            )}
            {renderMetricCard(
              'Total Tours',
              stats.tours.length,
              null,
              <MapPin className="w-5 h-5 text-purple-500" />,
              'bg-purple-50'
            )}
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Total Revenue</span>
                  </div>
                  <span className="font-medium">{formatCurrency(stats.financials.totalRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Monthly Revenue</span>
                  </div>
                  <span className="font-medium">{formatCurrency(stats.financials.monthlyRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Avg. Revenue/Tour</span>
                  </div>
                  <span className="font-medium">{formatCurrency(stats.financials.avgRevenuePerTour)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Projected Revenue</span>
                  </div>
                  <span className="font-medium text-blue-600">{formatCurrency(stats.financials.projectedRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Conversion Rate</span>
                  </div>
                  <span className="font-medium">{stats.financials.conversionRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Tour Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tour</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Bookings</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Revenue</th>
                      <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.tours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-lg">
                              <img className="object-cover w-full h-full" src={`https://source.unsplash.com/random/100x100/?${tour.title.split(' ')[0]}`} alt={tour.title} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                              <div className="text-xs text-gray-500">
                                {tour.stops} stops • {tour.media.audio} audio • {tour.media.images} images
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tour.status === 'published' ? 'bg-green-100 text-green-800' : 
                            tour.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div>
                            <span className="text-gray-900">{tour.bookings}</span>
                            {renderTrendIndicator(tour.bookingTrend)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div>
                            <span className="text-gray-900">{formatCurrency(tour.revenue)}</span>
                            {renderTrendIndicator(tour.revenueTrend)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap">
                          {tour.rating ? (
                            <div className="flex items-center justify-end">
                              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                              <span>{tour.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Visitor Engagement</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Total Visitors</span>
                  </div>
                  <span className="font-medium">{stats.engagement.totalVisitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">New Visitors</span>
                  </div>
                  <span className="font-medium">{stats.engagement.newVisitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Repeat className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Returning Visitors</span>
                  </div>
                  <span className="font-medium">{stats.engagement.returningVisitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Favorites</span>
                  </div>
                  <span className="font-medium">{stats.engagement.favoriteTours.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Shares</span>
                  </div>
                  <span className="font-medium">{stats.engagement.shares.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">Avg. Session</span>
                  </div>
                  <span className="font-medium">{stats.engagement.avgSessionDuration}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Content Analysis</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-500">Media Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center text-sm font-medium text-gray-700">
                          <Headphones className="w-4 h-4 mr-2 text-blue-500" />
                          Audio Clips
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {stats.tours.reduce((sum, tour) => sum + tour.media.audio, 0)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center text-sm font-medium text-gray-700">
                          <ImageIcon className="w-4 h-4 mr-2 text-green-500" />
                          Images
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {stats.tours.reduce((sum, tour) => sum + tour.media.images, 0)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-600 rounded-full" 
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center text-sm font-medium text-gray-700">
                          <Video className="w-4 h-4 mr-2 text-purple-500" />
                          Videos
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {stats.tours.reduce((sum, tour) => sum + tour.media.videos, 0)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-purple-600 rounded-full" 
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-500">Tour Completion</h4>
                  <div className="flex items-center justify-center h-full">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-green-500"
                          strokeWidth="8"
                          strokeDasharray={`${stats.performance.completionRate * 2.51}, 251`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                        <div className="text-2xl font-bold text-gray-900">{stats.performance.completionRate}%</div>
                      </div>
                    </div>
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

export default GuideDashboard;