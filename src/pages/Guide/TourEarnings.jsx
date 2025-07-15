import React, { useState, useEffect } from "react";
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaStar, 
  FaUsers,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaChevronDown,
  FaSearch,
  FaDownload,
  FaReceipt
} from "react-icons/fa";
import { useAuth } from '../../contexts/authContext';
// import { getGuideEarnings } from "../../api/earnings/earningsApi";

const GuideEarnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [earningsData, setEarningsData] = useState(null);

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const fetchEarningsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters = {
        timeRange,
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await getGuideEarnings(authState.user.id, filters);
      
      if (response.success) {
        setEarningsData(response.data);
        setTotalPages(response.totalPages);
      } else {
        throw new Error(response.message || 'Failed to fetch earnings data');
      }
    } catch (err) {
      setError('Failed to load earnings data. Please try again.');
      console.error('Error fetching earnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEarningsData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange, currentPage, authState.user.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', { 
      style: 'currency', 
      currency: 'LKR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Completed' };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', label: status };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-col max-w-2xl gap-2">
              <span className="text-sm font-medium tracking-wide text-teal-400">FINANCIAL DASHBOARD</span>
              <h1 className="text-3xl font-light leading-tight text-white">My Earnings</h1>
              <p className="text-slate-300">Track your tour earnings, withdrawals, and financial performance</p>
            </div>
            <button className="flex items-center px-5 py-3 font-medium text-white transition-all duration-300 bg-teal-600 rounded-lg hover:bg-teal-700 hover:shadow-lg">
              <FaMoneyBillWave className="w-4 h-4 mr-2" />
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          {/* Action Bar */}
          <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                >
                  {timeRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaSearch className="w-4 h-4 text-slate-400" />
                </button>
              </form>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          ) : earningsData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Earnings */}
                <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl group hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-20"></div>
                  <div className="relative flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-blue-100 text-blue-600">
                      <FaMoneyBillWave className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Earnings</p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {formatCurrency(earningsData.totalEarnings)}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-green-600">
                        <span>↑ {earningsData.earningsChange}% from last period</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completed Tours */}
                <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl group hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 opacity-20"></div>
                  <div className="relative flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-teal-100 text-teal-600">
                      <FaUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Completed Tours</p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {earningsData.completedTours}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-slate-500">
                        <span>{earningsData.avgToursPerDay} avg/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl group hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 opacity-20"></div>
                  <div className="relative flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-amber-100 text-amber-600">
                      <FaStar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Average Rating</p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {earningsData.avgRating}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(earningsData.avgRating) ? 'text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-slate-500">({earningsData.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Withdrawal */}
                <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-xl group hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-20"></div>
                  <div className="relative flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-purple-100 text-purple-600">
                      <FaFileInvoiceDollar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Available for Withdrawal</p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {formatCurrency(earningsData.pendingWithdrawal)}
                      </p>
                      <button className="mt-2 text-xs font-medium text-purple-600 hover:text-purple-700">
                        Request Withdrawal →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Chart */}
              <div className="p-6 mb-8 bg-white rounded-xl shadow-sm">
                <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
                  <h3 className="text-lg font-semibold text-slate-800">Earnings Overview</h3>
                  <div className="flex items-center mt-2 space-x-2 md:mt-0">
                    <button className="px-3 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                      Earnings
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                      Tours
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                      Ratings
                    </button>
                  </div>
                </div>

                <div className="h-64">
                  <div className="relative h-full">
                    {/* Chart Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <div 
                          key={percent}
                          className="relative border-t border-slate-200"
                        >
                          <span className="absolute left-0 text-xs transform -translate-y-1/2 text-slate-500">
                            {formatCurrency((percent / 100) * earningsData.maxChartValue)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Chart Bars */}
                    <div className="absolute bottom-0 flex items-end w-full h-[calc(100%-2rem)] space-x-2">
                      {earningsData.chartData.map((item, index) => (
                        <div 
                          key={index}
                          className="relative flex-1 group"
                          style={{ height: `${(item.value / earningsData.maxChartValue) * 100}%` }}
                        >
                          <div className="absolute bottom-0 w-full h-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300"></div>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {formatCurrency(item.value)}
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                  <button className="flex items-center px-3 py-1 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100">
                    <FaDownload className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Tour Package
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Traveler
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {earningsData.transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <FaCalendarAlt className="flex-shrink-0 mr-2 text-slate-400" />
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                            {transaction.tourPackage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {transaction.traveler}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(transaction.status).bg} ${getStatusBadge(transaction.status).text}`}>
                              {getStatusBadge(transaction.status).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="flex items-center text-blue-600 hover:text-blue-800">
                              <FaReceipt className="w-4 h-4 mr-1" />
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-slate-500">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, earningsData.totalTransactions)}</span> of{' '}
                      <span className="font-medium">{earningsData.totalTransactions}</span> transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
                {/* Popular Package */}
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-800">Most Popular Package</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 mr-3 bg-slate-100 rounded-lg overflow-hidden">
                      {earningsData.popularPackage.image && (
                        <img src={earningsData.popularPackage.image} alt="" className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{earningsData.popularPackage.name}</h4>
                      <p className="text-sm text-slate-500">{earningsData.popularPackage.tours} bookings</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${earningsData.popularPackage.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>{earningsData.popularPackage.percentage}% of earnings</span>
                    <span>{formatCurrency(earningsData.popularPackage.earnings)}</span>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-800">Conversion Rate</h3>
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${earningsData.conversionRate}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-800">{earningsData.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Views to bookings conversion</p>
                    <p className="text-xs text-slate-500">{earningsData.totalViews} views, {earningsData.totalBookings} bookings</p>
                  </div>
                </div>

                {/* Repeat Customers */}
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-800">Repeat Customers</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <FaUsers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{earningsData.repeatCustomers} travelers</h4>
                        <p className="text-sm text-slate-500">{earningsData.repeatRate}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{earningsData.repeatBookings}</p>
                      <p className="text-xs text-slate-500">bookings</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${earningsData.repeatRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>New customers</span>
                    <span>Repeat customers</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GuideEarnings;