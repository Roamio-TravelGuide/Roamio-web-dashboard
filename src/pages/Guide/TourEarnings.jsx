import React from 'react';

const TourEarnings = () => {
  // Sample data - 90% of tour price goes to guide, 10% to platform
  const earningsData = {
    totalEarnings: 45250.00,  // Total earned (90% of all completed tours)
    platformFees: 5027.78,    // 10% of total tour value
    thisMonthEarnings: 28750.00,
    lastMonthEarnings: 24300.00,
    percentageChange: 18.2,
    topTours: [
      { name: "Sigiriya Rock Fortress", gross: 20555.56, net: 18500.00 },
      { name: "Kandy Temple Tour", gross: 13666.67, net: 12300.00 },
      { name: "Gale Fort Walk", gross: 9722.22, net: 8750.00 }
    ],
    transactions: [
      { 
        date: "Jan 15, 2025", 
        tour: "Sigiriya Rock Fortress", 
        id: "TXNL_001", 
        grossAmount: 8333.33, 
        netAmount: 7500.00,
        status: "Completed" 
      },
      { 
        date: "Jan 12, 2025", 
        tour: "Kandy Temple Tour", 
        id: "TXNL_002", 
        grossAmount: 4666.67, 
        netAmount: 4200.00,
        status: "Pending" 
      },
      { 
        date: "Jan 10, 2025", 
        tour: "Gale Fort Walk", 
        id: "TXNL_003", 
        grossAmount: 4222.22, 
        netAmount: 3800.00,
        status: "Completed" 
      }
    ],
    totalTransactions: 23
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Tour Guide Earnings</h1>
          
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Side - Earnings Summary (1/3 width) */}
            <div className="w-full space-y-6 lg:w-1/3">
              {/* Total Earnings */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-2 text-sm font-medium text-gray-500">Total Earnings</h2>
                <p className="mb-2 text-3xl font-bold text-gray-800">
                  LKR {earningsData.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Platform fees:</span> LKR {earningsData.platformFees.toLocaleString('en-US', {minimumFractionDigits: 2})} (10%)
                </p>
              </div>

              {/* Monthly Comparison */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-2 text-sm font-medium text-gray-500">This Month vs Last Month</h2>
                <p className="text-2xl font-bold text-gray-800">
                  LKR {earningsData.thisMonthEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})} 
                  <span className="ml-2 text-sm text-green-600">↑ {earningsData.percentageChange}%</span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  vs LKR {earningsData.lastMonthEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})} last month
                </p>
              </div>

              {/* Top Performing Tours */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 text-sm font-medium text-gray-500">Top Performing Tours</h2>
                <div className="space-y-3">
                  {earningsData.topTours.map((tour, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 truncate">{tour.name}</span>
                        <span className="font-medium">LKR {tour.net.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Gross: LKR {tour.gross.toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Chart and Transactions (2/3 width) */}
            <div className="w-full space-y-6 lg:w-2/3">
              {/* Earnings Chart */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 font-medium text-gray-800">Earnings Breakdown</h2>
                <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-100 rounded-md">
                  <div className="text-center">
                    <p>Net Earnings vs Platform Fees</p>
                    <p className="text-sm">(90% guide / 10% platform)</p>
                  </div>
                  {/* Replace with actual chart component */}
                </div>
              </div>

              {/* Transaction History */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-4 font-medium text-gray-800">Booking Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">DATE</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">TOUR</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">GROSS</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">NET</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earningsData.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.tour}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            LKR {transaction.grossAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-green-700 whitespace-nowrap">
                            LKR {transaction.netAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 text-right bg-gray-50">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{earningsData.transactions.length}</span> of <span className="font-medium">{earningsData.totalTransactions}</span> transactions
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