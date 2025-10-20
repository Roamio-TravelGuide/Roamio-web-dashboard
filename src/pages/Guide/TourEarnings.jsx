import React, { useState, useEffect } from 'react';
import { getRevenueById, getPaidPackagesById } from '../../api/guide/guideApi';
import { useAuth } from '../../contexts/authContext';

const TourEarnings = () => {
  const { authState } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [paidPackages, setPaidPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authState?.user?.id) {
        setInitializationError('Please login to view earnings');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('User ID:', authState.user.id); // Log user ID being used

        const [revenueResponse, packagesResponse] = await Promise.all([
          getRevenueById(authState.user.id),
          getPaidPackagesById(authState.user.id)
        ]);

        console.log('Raw Revenue Response:', revenueResponse);
        console.log('Revenue Data Structure:', revenueResponse?.data);
        console.log('Raw Packages Response:', packagesResponse);
        console.log('Packages Data Structure:', packagesResponse?.data);

        if (revenueResponse?.data) {
          setRevenueData(revenueResponse.data);
        }

        if (packagesResponse?.data) {
          setPaidPackages(packagesResponse.data);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setInitializationError('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState?.user?.id]);

  const formatCurrency = (value) => {
    if (value == null) return 'Rs 0';
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(amount)) return 'Rs 0';
    
    const intPart = Math.floor(amount);
    const formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `Rs ${formatted}`;
  };

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-gray-600">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-5 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Initialization Error</h2>
          <p className="text-gray-600 mb-4">{initializationError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate values from the API response
  const totalEarnings = revenueData?.[0]?.total_revenue ? formatCurrency(revenueData[0].total_revenue) : 'Rs 0';
  const weeklyRevenue = revenueData?.[0]?.weekly_revenue ? formatCurrency(revenueData[0].weekly_revenue) : 'Rs 0';
  const downloads = revenueData?.[0]?.total_payments?.toString() || '0';
  
  // Calculate earnings summary from the API response
  const total = revenueData?.[0]?.total_revenue || 0;
  const gross = formatCurrency(total);
  const feeNum = total * 0.10; // 10% platform fee
  const platformFee = `-${formatCurrency(feeNum)}`;
  const netNum = total - feeNum;
  const net = formatCurrency(netNum);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Earnings</h1>
          
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Side - Main Stats */}
            <div className="w-full space-y-6 lg:w-1/3">
              {/* Total Earnings Card */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-2 text-sm font-medium text-gray-500">Total Earnings</h2>
                <p className="mb-2 text-3xl font-bold text-gray-800">{totalEarnings}</p>
                <p className="text-sm text-gray-600">Total revenue from all audio tours</p>
              </div>

              {/* Weekly Revenue & Downloads */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 text-sm font-medium text-gray-500">This Week</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Weekly Revenue</span>
                    <span className="font-bold text-gray-800">{weeklyRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-bold text-gray-800">{downloads}</span>
                  </div>
                </div>
              </div>

              {/* Earnings Summary */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 text-sm font-medium text-gray-500">Earnings Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gross Earnings</span>
                    <span className="font-medium text-gray-800">{gross}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Fee (10%)</span>
                    <span className="font-medium text-red-600">{platformFee}</span>
                  </div>
                  <hr className="border-gray-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-semibold">Net Earnings</span>
                    <span className="font-bold text-green-600">{net}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Transactions */}
            <div className="w-full space-y-6 lg:w-2/3">
              {/* Recent Transactions */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 font-medium text-gray-800">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">TOUR</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">DATE</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paidPackages.map((transaction, index) => {
                        const date = new Date(transaction.createdAt || transaction.paid_at);
                        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {transaction.tourPackage?.title || transaction.package_title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {formatCurrency(transaction.amount || transaction.price)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 text-right bg-gray-50">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{paidPackages.length}</span> of <span className="font-medium">{paidPackages.length}</span> transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourEarnings;