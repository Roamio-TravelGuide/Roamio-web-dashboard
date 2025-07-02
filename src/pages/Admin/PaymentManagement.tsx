import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  RefreshCw,
  Calendar,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const PaymentManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const paymentStats = [
    {
      title: 'Total Revenue',
      value: '$125,847',
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Guide Commissions',
      value: '$43,291',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Vendor Payments',
      value: '$18,456',
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'amber'
    },
    {
      title: 'Pending Payouts',
      value: '$12,387',
      change: '-3%',
      changeType: 'negative' as const,
      icon: RefreshCw,
      color: 'purple'
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      user: 'Sarah Johnson',
      userType: 'Travel Guide',
      type: 'Commission',
      amount: 245.50,
      status: 'Completed',
      date: '2024-01-15',
      description: 'Paris Walking Tour - Commission (35%)',
      method: 'Bank Transfer',
      tourTitle: 'Historic Paris Walking Tour'
    },
    {
      id: 'TXN-002',
      user: 'Mike Chen',
      userType: 'Traveller',
      type: 'Payment',
      amount: 24.99,
      status: 'Completed',
      date: '2024-01-15',
      description: 'Tokyo Food Tour - Audio Package',
      method: 'Credit Card',
      tourTitle: 'Tokyo Street Food Adventure'
    },
    {
      id: 'TXN-003',
      user: 'Café Central',
      userType: 'Vendor',
      type: 'Sponsored Listing',
      amount: 150.00,
      status: 'Pending',
      date: '2024-01-14',
      description: 'Premium listing placement - 1 month',
      method: 'PayPal',
      tourTitle: null
    },
    {
      id: 'TXN-004',
      user: 'Emma Davis',
      userType: 'Travel Guide',
      type: 'Commission',
      amount: 189.30,
      status: 'Processing',
      date: '2024-01-14',
      description: 'London History Tour - Commission (40%)',
      method: 'Bank Transfer',
      tourTitle: 'London Historic Landmarks'
    },
    {
      id: 'TXN-005',
      user: 'Restaurant Bella Vista',
      userType: 'Vendor',
      type: 'Sponsored Listing',
      amount: 200.00,
      status: 'Completed',
      date: '2024-01-13',
      description: 'Featured placement - 3km radius',
      method: 'Credit Card',
      tourTitle: null
    },
    {
      id: 'TXN-006',
      user: 'Lisa Park',
      userType: 'Travel Guide',
      type: 'Commission',
      amount: 312.75,
      status: 'Failed',
      date: '2024-01-13',
      description: 'Seoul Cultural Tour - Commission (45%)',
      method: 'Bank Transfer',
      tourTitle: 'Seoul Traditional Culture Tour'
    }
  ];

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || 
      transaction.status.toLowerCase() === selectedFilter;
    
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (filterId: string) => {
    if (filterId === 'all') return transactions.length;
    return transactions.filter(t => t.status.toLowerCase() === filterId).length;
  };

  const filterOptions = [
    { id: 'all', label: 'All Transactions' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'failed', label: 'Failed' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'Completed': 'bg-emerald-100 text-emerald-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Payment': 'bg-blue-100 text-blue-800',
      'Commission': 'bg-emerald-100 text-emerald-800',
      'Sponsored Listing': 'bg-purple-100 text-purple-800',
      'Refund': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color as keyof typeof colors];
  };

  const getIconBg = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      purple: 'bg-purple-500'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paymentStats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-xl border ${getColorClasses(stat.color)} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${getIconBg(stat.color)} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedFilter === option.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({getFilterCount(option.id)})
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.id}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                      {transaction.tourTitle && (
                        <p className="text-xs text-teal-600 mt-1">{transaction.tourTitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.user}</p>
                      <p className="text-sm text-gray-500">{transaction.userType}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{transaction.method}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="More Options">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
            <span className="font-medium">{filteredTransactions.length}</span> transactions
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;