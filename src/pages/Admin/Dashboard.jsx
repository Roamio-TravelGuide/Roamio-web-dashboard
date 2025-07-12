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
} from "lucide-react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const chartRef = useRef(null);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartRef.current.chart) chartRef.current.chart.destroy();

      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Revenue (Rs.)",
              data: [185000, 210000, 195000, 224000, 238000, 268000, 284500],
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (value) => "Rs." + value.toLocaleString() },
            },
            x: { grid: { display: false } },
          },
          plugins: { legend: { display: false } },
        },
      });
    }
    return () => chartRef.current?.chart?.destroy();
  }, []);

  // Most Critical Admin Metrics
  const criticalMetrics = [
    {
      title: "Total Revenue",
      value: "Rs. 12,84,700",
      change: "+18.5%",
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Active Users",
      value: "8,463",
      change: "+12.3%",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Vendors business license",
      value: "24",
      change: "+5",
      icon: Shield,
      color: "from-yellow-500 to-amber-600",
    },
  ];

  // Package and Vendor Stats
  const monthlyStats = [
    {
      title: "Monthly Sold Packages",
      value: "142",
      change: "+8%",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Published Packages",
      value: "87",
      change: "+12%",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "New Vendors Added",
      value: "23",
      change: "+5%",
      icon: Briefcase,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // User Management Summary
  const userManagement = {
    pendingVerification: 12,
    suspendedAccounts: 5,
  };

  // Financial Overview
  const financials = {
    totalRevenue: "Rs. 12,84,700",
    RevenuefromPackages: "Rs. 12,84,70",
    commissionEarned: "Rs. 2,57,000",
    revenueFromVendors: "Rs. 1,23,000",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}

        {/* Critical Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {criticalMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}
                >
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.change.startsWith("+")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-4">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Revenue Overview</h2>
                <div className="flex items-center text-sm text-blue-600">
                  <Activity className="w-4 h-4 mr-1" />
                  <span>Real-time</span>
                </div>
              </div>
              <div className="h-78">
                {" "}
                {/* Increased height */}
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {monthlyStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center h-15">
                    <div className={`p-2 rounded-lg ${stat.color} mr-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <div className="flex items-end">
                        <h3 className="text-xl font-bold mr-2">{stat.value}</h3>
                        <span
                          className={`text-sm ${
                            stat.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* User Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="text-blue-500 mr-2" />
                User Management
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Shield className="text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mt-2">Pending</h3>
                  <p className="text-sm text-gray-600"> {userManagement.pendingVerification} accounts</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <UserX className="text-red-500" />
                  <h3 className="text-xl font-bold mt-2">Suspended</h3>
                  <p className="text-sm text-gray-600">
                    {userManagement.suspendedAccounts} accounts
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="text-green-500 mr-2" />
                Financial Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Revenue from tour packages
                  </span>
                  <span className="font-medium text-green-600 ">
                    {financials.RevenuefromPackages}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue from guide</span>
                  <span className="font-medium text-green-600">
                    {financials.commissionEarned}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue from vendors</span>
                  <span className="font-medium text-green-600">
                    {financials.revenueFromVendors}
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
