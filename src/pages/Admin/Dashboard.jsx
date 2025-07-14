import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Shield,
  UserPlus,
  UserX,
  CreditCard,
  Activity,
  BookOpen,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Calendar,
  Filter,
  Bell,
  Search,
  Settings,
  Download,
  Globe,
  BarChart3,
  PieChart,
  Target,
  Zap,
  MapPin,
  Clock,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Initialize main revenue chart
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartRef.current.chart) chartRef.current.chart.destroy();

      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Revenue (₹)",
              data: [185000, 210000, 195000, 224000, 238000, 268000, 284500],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#3B82F6",
              pointBorderColor: "#fff",
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              titleColor: "#F9FAFB",
              bodyColor: "#F9FAFB",
              borderColor: "rgba(59, 130, 246, 0.3)",
              borderWidth: 1,
              cornerRadius: 12,
              displayColors: false,
              padding: 16,
              titleFont: { size: 14, weight: "600" },
              bodyFont: { size: 13 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              border: { display: false },
              grid: {
                color: "rgba(229, 231, 235, 0.4)",
                drawBorder: false,
              },
              ticks: {
                color: "#6B7280",
                font: { size: 12, weight: "500" },
                callback: (value) => "₹" + value / 1000 + "K",
                padding: 12,
              },
            },
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: {
                color: "#6B7280",
                font: { size: 12, weight: "500" },
                padding: 8,
              },
            },
          },
        },
      });
    }
    return () => chartRef.current?.chart?.destroy();
  }, []);

  // Initialize pie chart
  useEffect(() => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext("2d");
      if (pieChartRef.current.chart) pieChartRef.current.chart.destroy();

      pieChartRef.current.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Tour Packages", "Guide Services", "Vendor Fees"],
          datasets: [
            {
              data: [895200, 257000, 132500],
              backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
              borderWidth: 0,
              cutout: "70%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              titleColor: "#F9FAFB",
              bodyColor: "#F9FAFB",
              cornerRadius: 12,
              displayColors: false,
              padding: 12,
            },
          },
        },
      });
    }
    return () => pieChartRef.current?.chart?.destroy();
  }, []);

  const criticalMetrics = [
    {
      title: "Total Revenue",
      value: "₹12,84,700",
      change: "+18.5%",
      changeValue: "vs last month",
      icon: DollarSign,
      trend: "up",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Users",
      value: "8,463",
      change: "+12.3%",
      changeValue: "vs last month",
      icon: Users,
      trend: "up",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Business Licenses",
      value: "24",
      change: "+5",
      changeValue: "this month",
      icon: Shield,
      trend: "up",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      changeValue: "vs last month",
      icon: Target,
      trend: "up",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const monthlyStats = [
    {
      title: "Packages Sold",
      value: "142",
      change: "+8%",
      icon: Package,
      trend: "up",
      description: "Tour bookings completed",
      color: "blue",
    },
    {
      title: "Packages Published",
      value: "87",
      change: "+12%",
      icon: BookOpen,
      trend: "up",
      description: "New tour packages added",
      color: "emerald",
    },
    {
      title: "New Vendors",
      value: "23",
      change: "+5%",
      icon: Briefcase,
      trend: "up",
      description: "Vendors joined this month",
      color: "purple",
    },
  ];

  const userManagement = {
    pendingVerification: 12,
    suspendedAccounts: 5,
    activeUsers: 8463,
    newSignups: 156,
  };

  const financials = {
    totalRevenue: "₹12,84,700",
    RevenuefromPackages: "₹8,95,200",
    commissionEarned: "₹2,57,000",
    revenueFromVendors: "₹1,32,500",
  };

  const periods = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
    { value: "1y", label: "1 year" },
  ];

  const recentActivities = [
    {
      type: "booking",
      message: "New booking for Goa Beach Package",
      time: "2 minutes ago",
      icon: Package,
      color: "blue",
    },
    {
      type: "vendor",
      message: "Adventure Tours verified",
      time: "15 minutes ago",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      type: "user",
      message: "5 new user registrations",
      time: "1 hour ago",
      icon: UserPlus,
      color: "purple",
    },
  ];
  const extendedStats = [
    {
      title: "Daily Active Users",
      value: "3,284",
      change: "+6.4%",
      icon: Users,
      trend: "up",
      description: "Users active in the last 24h",
      color: "indigo",
    },
    {
      title: "Avg Session Duration",
      value: "5m 27s",
      change: "+3.1%",
      icon: Clock,
      trend: "up",
      description: "Average time spent per visit",
      color: "sky",
    },
    {
      title: "Top-Selling Package",
      value: "Goa Beach Getaway",
      change: "+15%",
      icon: Package,
      trend: "up",
      description: "Most booked this month",
      color: "fuchsia",
    },
    {
      title: "ARPU",
      value: "₹152",
      change: "+9.8%",
      icon: DollarSign,
      trend: "up",
      description: "Average revenue per user",
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3"></div>
            </div>
          </div>
        </div>
      </div>
          <div className="lg:col-span-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Extended Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {extendedStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-600 font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Top Metrics - Beautiful Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {criticalMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      metric.trend === "up"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-500">{metric.changeValue}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    Revenue Trends
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Monthly performance overview
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <Zap className="w-4 h-4 mr-1" />
                    <span>Live Data</span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 text-purple-600 mr-2" />
                    Revenue Sources
                  </h2>
                  <p className="text-sm text-gray-600">Breakdown by category</p>
                </div>
              </div>
              <div className="h-48 mb-4">
                <canvas ref={pieChartRef}></canvas>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Tour Packages</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    69.7%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Guide Services
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    20.0%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Vendor Fees</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    10.3%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {monthlyStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-600 font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Extended Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {extendedStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-600 font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  User Management
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group">
                  <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 bg-amber-100 rounded-lg mr-3">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-amber-800">
                          Pending Verification
                        </span>
                        <p className="text-xs text-amber-600">
                          Awaiting approval
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-amber-900">
                      {userManagement.pendingVerification}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <UserX className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-red-800">
                          Suspended
                        </span>
                        <p className="text-xs text-red-600">
                          Temporarily blocked
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-red-900">
                      {userManagement.suspendedAccounts}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-800">
                          New Signups
                        </span>
                        <p className="text-xs text-emerald-600">This month</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-emerald-900">
                      {userManagement.newSignups}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 text-emerald-600 mr-2" />
                  Financial Summary
                </h2>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center group">
                  <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  Details
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">
                        Tour Packages
                      </span>
                      <p className="text-xs text-gray-500">
                        Revenue from bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {financials.RevenuefromPackages}
                    </span>
                    <div className="flex items-center text-xs text-emerald-600">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>12%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">
                        Guide Services
                      </span>
                      <p className="text-xs text-gray-500">
                        Commission from guides
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {financials.commissionEarned}
                    </span>
                    <div className="flex items-center text-xs text-emerald-600">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>8%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">
                        Vendor Fees
                      </span>
                      <p className="text-xs text-gray-500">
                        Revenue from vendors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {financials.revenueFromVendors}
                    </span>
                    <div className="flex items-center text-xs text-emerald-600">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Activities */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                Recent Activities
              </h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50/50 rounded-xl transition-colors group"
                  >
                    <div
                      className={`p-2 bg-${activity.color}-100 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <activity.icon
                        className={`w-4 h-4 text-${activity.color}-600`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group">
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Add New User</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Create Package</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Verify License</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
