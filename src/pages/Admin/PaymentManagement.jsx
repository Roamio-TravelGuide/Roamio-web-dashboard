import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Briefcase,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Award,
  Globe,
  Download,
  CheckCircle,
  Clock,
  X,
  Star,
  Headphones,
  Users,
  AlertTriangle,
  Paperclip,
  DollarSign,
  Package,
  Upload,
  User,
  Building,
  Coffee,
  CreditCard,
  TrendingUp,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Shield,
  Zap,
  Target,
  MapIcon,
  Store,
  Navigation,
  Banknote,
  PieChart,
  BarChart3,
  Activity,
  Plus,
  Minus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  FileX,
  Wifi,
  WifiOff,
  Pause,
  Play,
} from "lucide-react";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showBankProcessingModal, setShowBankProcessingModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('30days');

  // Sample transaction data with new structure
  const transactions = [
    {
      id: "TXN001",
      transactionId: "PH_001234567",
      user: "Mike Chen",
      userEmail: "mike.chen@email.com",
      type: "tour_purchase",
      amount: 25000,
      status: "success",
      date: "2024-01-15T10:30:00Z",
      details: {
        packageName: "Tokyo Street Food Adventure",
        paymentMethod: "PayHere - Visa Card",
        commission: 2500,
        paidToGuide: 22500
      }
    },
    {
      id: "TXN002",
      transactionId: "PH_001234568",
      user: "Emma Davis",
      userEmail: "emma.davis@email.com",
      type: "vendor_listing",
      amount: 5000,
      status: "success",
      date: "2024-01-14T14:20:00Z",
      details: {
        vendorName: "The Crown & Anchor Pub - Featured Listing (1km)",
        paymentMethod: "PayHere - Bank Transfer"
      }
    },
    {
      id: "TXN003",
      transactionId: "PH_001234569",
      user: "John Smith",
      userEmail: "john.smith@email.com",
      type: "tour_purchase",
      amount: 18000,
      status: "pending",
      date: "2024-01-14T09:15:00Z",
      details: {
        packageName: "Kyoto Temple Walk",
        paymentMethod: "PayHere - Mobile Wallet",
        commission: 1800,
        paidToGuide: 16200
      }
    },
    {
      id: "TXN004",
      transactionId: "GP_001234570",
      user: "John Silva",
      userEmail: "john.silva@email.com",
      type: "guide_payout",
      amount: 36000,
      status: "pending",
      date: "2024-01-12T11:30:00Z",
      details: {
        guideName: "John Silva",
        paymentMethod: "Bank Transfer"
      }
    },
    {
      id: "TXN005",
      transactionId: "PH_001234571",
      user: "Sarah Johnson",
      userEmail: "sarah.johnson@email.com",
      type: "tour_purchase",
      amount: 30000,
      status: "success",
      date: "2024-01-10T16:45:00Z",
      details: {
        packageName: "Colombo Heritage Walk",
        paymentMethod: "PayHere - Bank Transfer",
        commission: 3000,
        paidToGuide: 27000
      }
    },
    {
      id: "TXN006",
      transactionId: "PH_001234572",
      user: "Café Aroma",
      userEmail: "cafe.aroma@email.com",
      type: "vendor_listing",
      amount: 8000,
      status: "failed",
      date: "2024-01-12T11:30:00Z",
      details: {
        vendorName: "Café Aroma - Premium Listing (200m)",
        paymentMethod: "PayHere - Credit Card"
      }
    },
    {
      id: "TXN007",
      transactionId: "GP_001234573",
      user: "Sarah Johnson",
      userEmail: "sarah.johnson@email.com",
      type: "guide_payout",
      amount: 54000,
      status: "failed",
      date: "2024-01-11T14:20:00Z",
      details: {
        guideName: "Sarah Johnson",
        paymentMethod: "Bank Transfer"
      }
    }
  ];

  // Guide payout data with updated fields
  const guidePayouts = [
    {
      payoutId: "PO_001",
      guideName: "John Silva",
      packageName: "Tokyo Street Food Adventure",
      purchaseAmount: 40000,
      commission: 4000,
      payableAmount: 36000,
      payoutStatus: "pending"
    },
    {
      payoutId: "PO_002",
      guideName: "Sarah Johnson",
      packageName: "Colombo Heritage Walk",
      purchaseAmount: 60000,
      commission: 6000,
      payableAmount: 54000,
      payoutStatus: "unpaid"
    },
    {
      payoutId: "PO_003",
      guideName: "Lisa Park",
      packageName: "Kyoto Temple Walk",
      purchaseAmount: 25000,
      commission: 2500,
      payableAmount: 22500,
      payoutStatus: "success",
      lastPayout: "2024-01-01"
    },
    {
      payoutId: "PO_004",
      guideName: "David Kim",
      packageName: "Galle Fort Discovery",
      purchaseAmount: 15000,
      commission: 1500,
      payableAmount: 13500,
      payoutStatus: "failed"
    }
  ];

  // Vendor listing data with updated structure
  const vendorListings = [
    {
      vendorName: "Café Aroma",
      vendorEmail: "contact@cafearoma.lk",
      vendorPhone: "+94 77 123 4567",
      listingType: "Featured",
      paymentAmount: 5000,
      duration: "30 days",
      status: "active",
      startDate: "2024-07-10",
      expiryDate: "2024-08-10",
      paymentReference: "PH_001234568",
      visibilityStatus: "active",
      location: "Colombo 03, Sri Lanka"
    },
    {
      vendorName: "The Crown & Anchor Pub",
      vendorEmail: "info@crownanchor.lk",
      vendorPhone: "+94 11 234 5678",
      listingType: "Premium",
      paymentAmount: 8000,
      duration: "30 days",
      status: "active",
      startDate: "2024-07-15",
      expiryDate: "2024-08-15",
      paymentReference: "PH_001234569",
      visibilityStatus: "active",
      location: "Galle Face, Colombo"
    },
    {
      vendorName: "Borough Market Café",
      vendorEmail: "hello@boroughmarket.lk",
      vendorPhone: "+94 70 987 6543",
      listingType: "Standard",
      paymentAmount: 3000,
      duration: "30 days",
      status: "expired",
      startDate: "2024-06-20",
      expiryDate: "2024-07-20",
      paymentReference: "PH_001234570",
      visibilityStatus: "hidden",
      location: "Kandy, Sri Lanka"
    }
  ];

  // Calculate summary data
  const totalRevenue = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const pendingPayouts = transactions.filter(t => t.type === 'guide_payout' && t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const vendorListingsRevenue = transactions.filter(t => t.type === 'vendor_listing' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalCommissions = transactions.filter(t => t.type === 'tour_purchase' && t.status === 'success').reduce((sum, t) => sum + (t.details?.commission || 0), 0);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPayoutStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'unpaid':
        return <AlertTriangle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tour_purchase':
        return <Headphones className="w-4 h-4 text-blue-500" />;
      case 'vendor_listing':
        return <Store className="w-4 h-4 text-purple-500" />;
      case 'guide_payout':
        return <Wallet className="w-4 h-4 text-green-500" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'tour_purchase':
        return 'Tour Purchase';
      case 'vendor_listing':
        return 'Vendor Listing';
      case 'guide_payout':
        return 'Guide Payout';
      default:
        return type;
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      console.log('Deleting transaction:', transactionId);
      alert('Transaction deleted successfully!');
    }
  };

  const handleRetryTransaction = (transactionId) => {
    console.log('Retrying transaction:', transactionId);
    alert('Transaction retry initiated!');
  };

  const handleExportData = () => {
    console.log('Exporting payment data...');
    alert('Payment data exported successfully!');
  };

  const handleProcessPayout = (guideName) => {
    console.log('Processing payout for:', guideName);
    alert(`Payout processed for ${guideName}!`);
    setShowTransactionDetails(false);
  };

  const handleAwaitingBank = () => {
    setShowBankProcessingModal(true);
  };

  const handleViewDetails = (guideName) => {
    console.log('Viewing details for:', guideName);
    alert(`Viewing payout details for ${guideName}`);
  };

  const handlePayNow = (guideName) => {
    console.log('Processing payment for:', guideName);
    alert(`Processing payment for ${guideName}...`);
  };

  const handleRetry = (guideName) => {
    console.log('Retrying payment for:', guideName);
    alert(`Retrying payment for ${guideName}...`);
  };

  const handleManageListing = (listing) => {
    setSelectedListing(listing);
    setShowManageModal(true);
  };

  const handleRenewListing = (listing) => {
    setSelectedListing(listing);
    setShowRenewModal(true);
  };

  const handlePauseListing = () => {
    console.log('Pausing listing...');
    alert('Listing paused successfully!');
    setShowManageModal(false);
  };

  const handleContactVendor = () => {
    console.log('Contacting vendor...');
    alert('Vendor contacted successfully!');
    setShowManageModal(false);
  };

  const handleSendRenewalReminder = () => {
    console.log('Sending renewal reminder...');
    alert('Renewal reminder sent to vendor!');
    setShowRenewModal(false);
  };

  const renderPaymentOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">💰 Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">LKR {totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">All payments received</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">⏳ Pending Payouts</p>
              <p className="text-2xl font-bold text-orange-900">LKR {pendingPayouts.toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">Guide payments pending</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Clock className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">📦 Vendor Listings Revenue</p>
              <p className="text-2xl font-bold text-purple-900">LKR {vendorListingsRevenue.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Sponsored placements</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Store className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">🧾 Total Commissions Earned</p>
              <p className="text-2xl font-bold text-green-900">LKR {totalCommissions.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">(10% from tours)</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <PieChart className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-80"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="tour_purchase">Tour Purchase</option>
                <option value="vendor_listing">Vendor Listing</option>
                <option value="guide_payout">Guide Payout</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-blue-600">{transaction.transactionId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.user}</p>
                      <p className="text-sm text-gray-500">{transaction.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(transaction.type)}
                      <span className="text-sm text-gray-900">
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      LKR {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      {transaction.status === 'failed' && (transaction.type === 'vendor_listing' || transaction.type === 'guide_payout') && (
                        <button
                          onClick={() => handleRetryTransaction(transaction.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Retry Transaction"
                        >
                          <RefreshCw className="w-4 h-4 text-orange-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCommissionPayouts = () => (
    <div className="space-y-6">
      {/* Tour Guide Payouts */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tour Guide Payouts</h3>
          <button
            onClick={() => alert('Bulk payout processing initiated!')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Process All Unpaid
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payout ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Guide</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Package</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Purchase Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payable Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payout Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {guidePayouts.map((payout, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-blue-600">{payout.payoutId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{payout.guideName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{payout.packageName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">LKR {payout.purchaseAmount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-red-600 font-medium">LKR {payout.commission.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-green-600">LKR {payout.payableAmount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {getPayoutStatusIcon(payout.payoutStatus)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPayoutStatusColor(payout.payoutStatus)}`}>
                        {payout.payoutStatus === 'success' ? 'Success' :
                         payout.payoutStatus === 'pending' ? 'Pending' :
                         payout.payoutStatus === 'unpaid' ? 'Unpaid' :
                         'Failed'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {payout.payoutStatus === 'pending' && (
                      <button
                        onClick={handleAwaitingBank}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        Awaiting Bank
                      </button>
                    )}
                    {payout.payoutStatus === 'success' && (
                      <button
                        onClick={() => handleViewDetails(payout.guideName)}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                    {payout.payoutStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePayNow(payout.guideName)}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                    {payout.payoutStatus === 'failed' && (
                      <button
                        onClick={() => handleRetry(payout.guideName)}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVendorListings = () => (
    <div className="space-y-6">
      {/* Vendor Listing Payments */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Vendor Listing Payments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Vendor Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Listing</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expiry Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendorListings.map((listing, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">{listing.vendorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.listingType === 'Premium' ? 'bg-yellow-100 text-yellow-800' :
                      listing.listingType === 'Featured' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.listingType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">LKR {listing.paymentAmount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{listing.duration}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {listing.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </>
                      ) : listing.status === 'expired' ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {new Date(listing.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {listing.status === 'expired' ? (
                      <button
                        onClick={() => handleRenewListing(listing)}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        Renew
                      </button>
                    ) : (
                      <button
                        onClick={() => handleManageListing(listing)}
                        className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
                      >
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Roamio payment system powered by PayHere</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">PayHere Connected</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-1 rounded-xl border border-gray-200">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Payment Overview', icon: BarChart3 },
            { id: 'payouts', label: 'Commission & Payouts', icon: Wallet },
            { id: 'listings', label: 'Vendor Listings', icon: Store }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderPaymentOverview()}
      {activeTab === 'payouts' && renderCommissionPayouts()}
      {activeTab === 'listings' && renderVendorListings()}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setShowTransactionDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Transaction Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transaction ID</p>
                    <p className="text-gray-900">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">PayHere Payment ID</p>
                    <p className="text-gray-900 font-mono">{selectedTransaction.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer</p>
                    <p className="text-gray-900">{selectedTransaction.user}</p>
                    <p className="text-sm text-gray-500">{selectedTransaction.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payment Method</p>
                    <p className="text-gray-900">{selectedTransaction.details?.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Transfer Amount</h3>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Amount:</span>
                  <span className="font-bold text-blue-900">LKR {selectedTransaction.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Item Details */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  {selectedTransaction.type === 'tour_purchase' ? 'Tour Package Details' : 
                   selectedTransaction.type === 'vendor_listing' ? 'Vendor Listing Details' : 
                   'Guide Payout Details'}
                </h3>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(selectedTransaction.type)}
                  <span className="text-green-800 font-medium">
                    {selectedTransaction.details?.packageName || 
                     selectedTransaction.details?.vendorName || 
                     selectedTransaction.details?.guideName || 
                     getTypeLabel(selectedTransaction.type)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {/* Show Process Payment button only for pending guide payouts */}
                {selectedTransaction.type === 'guide_payout' && selectedTransaction.status === 'pending' && (
                  <button
                    onClick={() => handleProcessPayout(selectedTransaction.details?.guideName || selectedTransaction.user)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Process Payment</span>
                  </button>
                )}
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Processing Modal */}
      {showBankProcessingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Processing</h3>
              <p className="text-gray-600 mb-6">Bank processing in progress</p>
              <button
                onClick={() => setShowBankProcessingModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Listing Modal */}
      {showManageModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Manage Listing</h2>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Listing Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Listing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Listing Name & Type</p>
                    <p className="text-gray-900">{selectedListing.listingType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{selectedListing.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                    <p className="text-gray-900">{new Date(selectedListing.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">End Date</p>
                    <p className="text-gray-900">{new Date(selectedListing.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Vendor Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Name:</p>
                    <p className="text-blue-900">{selectedListing.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Email:</p>
                    <p className="text-blue-900">{selectedListing.vendorEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Phone:</p>
                    <p className="text-blue-900">{selectedListing.vendorPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Location:</p>
                    <p className="text-blue-900">{selectedListing.location}</p>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">Payment & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">Payment Reference:</p>
                    <p className="text-green-900 font-mono">{selectedListing.paymentReference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Visibility Status:</p>
                    <p className="text-green-900 capitalize">{selectedListing.visibilityStatus}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handlePauseListing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Listing</span>
                </button>
                <button
                  onClick={handleContactVendor}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Vendor</span>
                </button>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renew Listing Modal */}
      {showRenewModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Renew Listing</h2>
              <button
                onClick={() => setShowRenewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Expired Listing Summary */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3">Expired Listing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-red-700">Vendor:</span>
                    <span className="text-red-900 font-medium">{selectedListing.vendorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Listing Type:</span>
                    <span className="text-red-900 font-medium">{selectedListing.listingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Expired Date:</span>
                    <span className="text-red-900 font-medium">{new Date(selectedListing.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Previous Amount:</span>
                    <span className="text-red-900 font-medium">LKR {selectedListing.paymentAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleSendRenewalReminder}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Renewal Reminder</span>
                </button>
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;