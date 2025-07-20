import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Users,
  Star,
  ChevronRight,
  Eye,
  BarChart3,
  PiggyBank,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';


/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date
 * @property {string} package
 * @property {number} amount
 * @property {number} fee
 * @property {number} net
 * @property {'completed' | 'pending' | 'processing'} status
 */

function TourEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  const tourPackages = [
    {
      id: '1',
      title: 'Historic Paris Walking Tour',
      location: 'Paris, France',
      price: 12.99,
      downloads: 847,
      revenue: 8807.53,
      rating: 4.8,
      reviews: 156,
      status: 'active'
    },
    {
      id: '2',
      title: 'Venice Hidden Gems',
      location: 'Venice, Italy',
      price: 15.99,
      downloads: 623,
      revenue: 7990.77,
      rating: 4.6,
      reviews: 98,
      status: 'active'
    },
    {
      id: '3',
      title: 'Tokyo Street Food Adventure',
      location: 'Tokyo, Japan',
      price: 18.99,
      downloads: 412,
      revenue: 6279.88,
      rating: 4.9,
      reviews: 67,
      status: 'active'
    },
    {
      id: '4',
      title: 'Barcelona Modernist Architecture',
      location: 'Barcelona, Spain',
      price: 14.99,
      downloads: 298,
      revenue: 3584.02,
      rating: 4.5,
      reviews: 43,
      status: 'pending'
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      date: '2025-01-08',
      package: 'Historic Paris Walking Tour',
      amount: 12.99,
      fee: 1.95,
      net: 11.04,
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-01-08',
      package: 'Venice Hidden Gems',
      amount: 15.99,
      fee: 2.40,
      net: 13.59,
      status: 'completed'
    },
    {
      id: '3',
      date: '2025-01-07',
      package: 'Tokyo Street Food Adventure',
      amount: 18.99,
      fee: 2.85,
      net: 16.14,
      status: 'processing'
    },
    {
      id: '4',
      date: '2025-01-07',
      package: 'Historic Paris Walking Tour',
      amount: 12.99,
      fee: 1.95,
      net: 11.04,
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const totalEarnings = tourPackages.reduce((sum, pkg) => sum + pkg.revenue, 0);
  const totalDownloads = tourPackages.reduce((sum, pkg) => sum + pkg.downloads, 0);
  const avgRating = tourPackages.reduce((sum, pkg) => sum + pkg.rating, 0) / tourPackages.length;

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 -ml-15">
            <div>
              <h1 className="text-3xl text-white">Earnings Dashboard</h1>
              <p className="mt-1 text-sm text-teal-400">Track your tour guide revenue and performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-360 -ml-25">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Across all tours
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tours</p>
                <p className="text-3xl font-bold text-gray-900">{tourPackages.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tourPackages.filter(p => p.status === 'pending').length} pending approval
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tour Package Performance */}
        <div className="mb-8 w-360 -ml-25">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Tour Package Performance</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tourPackages.map((tour) => (
                  <div key={tour.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{tour.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                          {tour.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {tour.location}
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {tour.downloads} downloads
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                          {tour.rating} ({tour.reviews})
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900">${tour.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">${tour.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className='mb-8 w-360 -ml-25'>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.package}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${transaction.fee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.net.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {transaction.status === 'processing' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourEarnings;