import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  DollarSign,
  MessageSquare,
  TrendingUp,
  Headphones,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Users,
  Eye,
  Award,
  Building,
  Upload,
  AwardIcon,
  BuildingIcon,
  CheckSquareIcon,
} from "lucide-react";

const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const chartData = [
    { name: "Mon", thisMonth: 4000, lastMonth: 2400 },
    { name: "Tue", thisMonth: 3000, lastMonth: 1398 },
    { name: "Wed", thisMonth: 2000, lastMonth: 9800 },
    { name: "Thu", thisMonth: 2780, lastMonth: 3908 },
    { name: "Fri", thisMonth: 1890, lastMonth: 4800 },
    { name: "Sat", thisMonth: 2390, lastMonth: 3800 },
    { name: "Sun", thisMonth: 3490, lastMonth: 4300 },
  ];

  const stats = [
    {
      title: "Monthly Revenue",
      value: "$45,231",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Active Complaints",
      value: "23",
      change: "-8%",
      changeType: "negative",
      icon: MessageSquare,
      color: "amber",
    },
    {
      title: "Audio Tours",
      value: "1,847",
      change: "+5%",
      changeType: "positive",
      icon: Headphones,
      color: "purple",
    },
  ];

  // Users Data by Type
  const usersData = [
    { status: "Travellers", count: 28, color: "bg-blue-400" },
    { status: "Travel Guides", count: 12, color: "bg-emerald-400" },
    { status: "Vendors", count: 8, color: "bg-teal-400" },
    { status: "Moderators", count: 9, color: "bg-purple-400" },
  ];

  const totalUsers = usersData.reduce((sum, item) => sum + item.count, 0);

  // Pending Approvals Data
  const pendingApprovals = [
    {
      id: 1,
      type: "Guide Certifications",
      count: 5,
      description: "5 guides waiting",
      icon: Award,
      color: "bg-gradient-to-r from-emerald-100 to-teal-100",
    },
    {
      id: 2,
      type: "Vendor Applications",
      count: 3,
      description: "3 new applications",
      icon: Building,
      color: "bg-gradient-to-r from-blue-100 to-emerald-100",
    },
  ];

  const recentActivity = [
    {
      icon: <AwardIcon className="w-6 h-6 text-emerald-500" />,
      iconBg: "#E6F9F2", // soft green
      text: "Guide Maria Rodriguez completed certification",
      time: "2 hours ago",
      status: "success",
    },
    {
      icon: <BuildingIcon className="w-6 h-6 text-blue-400" />,
      iconBg: "#F0F6FF", // soft blue
      text: "New hotel vendor registered",
      time: "4 hours ago",
      status: "success",
    },
    {
      icon: <CheckSquareIcon className="w-6 h-6 text-orange-400" />,
      iconBg: "#FFF6EC", // soft orange
      text: "Complaint resolved for tour package",
      time: "6 hours ago",
      status: "resolved",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
      amber: "bg-amber-50 text-amber-600 border-amber-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      blue: "bg-blue-50 text-blue-600 border-blue-200",
    };
    return colors[color] || "";
  };

  const getIconBg = (color) => {
    const colors = {
      emerald: "bg-emerald-500",
      amber: "bg-amber-500",
      purple: "bg-purple-500",
      blue: "bg-blue-500",
    };
    return colors[color] || "";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 px-4">Dashboard</h1>
           <p className="text-black text-lg px-4">Welcome back! Here's what's happening today</p>
        </div>
      </div>

      {/* Stats Grid - Optimized Layout */}
      <div className=" lg:col-span-1 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Total Users Chart takes 1/4 width with color */}
        <div className=" bg-white p-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-600 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between  ">
            <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Chart and Legend in Row Layout */}
          <div className="flex items-center space-x-6">
            {/* Circular Chart */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg
                className="w-25 h-25 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="49, 51"
                  strokeDashoffset="0"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="21, 79"
                  strokeDashoffset="-49"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeDasharray="14, 86"
                  strokeDashoffset="-70"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray="16, 84"
                  strokeDashoffset="-84"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-900">
                    {totalUsers}
                  </div>
                  <div className="text-xs text-blue-600">Users</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              {usersData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-blue-700">{item.status}</span>
                  </div>
                  <span className="font-medium text-blue-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative bg-white pt-5 pb-5 px-3   rounded-xl border ${getColorClasses(
                stat.color
              )} hover:shadow-md hover:scale-[1.01] transition-all duration-300`}
            >
              {/* Icon in top-right corner */}
              <div
                className={`absolute top-4 right-4 w-10 h-10 ${getIconBg(
                  stat.color
                )} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-4">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-5">
                  {stat.value}
                </p>
                <div className="flex items-center">
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="bg-blue-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className=" px-5 py-4">
            
            <div className="flex items-center  space-x-3">
              <div className="w-10 h-10 bg-blue-800  bg-opacity-30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">
                  Pending Approvals
                </h3>
                <p className="text-black text-xs opacity-80">Action required</p>
              </div>
            </div>
          </div>
          <div className="space-y-5 px-6 pb-2 pt-5">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between bg-white rounded-xl shadow p-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg"
                    style={{ background: "#FFF6F0" }}
                  >
                    <approval.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-gray-900">
                      {approval.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {approval.description}
                    </p>
                  </div>
                </div>
                <button className="px-5 py-2 bg-blue-500 text-white text-sm rounded-xl font-semibold shadow hover:bg-blue-600 transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

       
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #e0fff4 0%, #e6f8ff 100%)",
          }}
        >
          {/* Header */}
          <div className=" px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">
                  Recent Activities
                </h3>
                <p className="text-black text-xs opacity-80">Live updates</p>
              </div>
            </div>
          </div>
          {/* Activity List */}
          <div className="px-6 py-4 space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-2xl shadow-sm px-4 py-3 space-x-4"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg"
                  style={{ background: activity.iconBg }}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.status === "success"
                      ? "bg-emerald-500"
                      : activity.status === "resolved"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="p">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Revenue
            </h3>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorThisMonth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorLastMonth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis hide />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="lastMonth"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorLastMonth)"
                    name="Last Month"
                  />
                  <Area
                    type="monotone"
                    dataKey="thisMonth"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorThisMonth)"
                    name="This Month"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center text-xs mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-500">Last Month</span>
              </div>
              <span className="text-gray-900 font-semibold">$1,004</span>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-500">This Month</span>
              </div>
              <span className="text-gray-900 font-semibold">$4,504</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1  gap-6">{/* Pending Approvals */}</div>
    </div>
  );
};

export default Dashboard;
