import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Package,
  Award,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  UserCheck,
  MapPin,
  Store,
  DollarSign,
  ArrowDownRight,
  Star,
  Crown,
  Trophy,
  Target,
  Medal,
  Zap,
  Plus,
} from "lucide-react";

// StatsCard Component
const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  bgGradient,
  loading = false,
  trend,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.isPositive
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(trend.value)}%
              </div>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-xl blur-sm opacity-20`}
          ></div>
          <div
            className={`relative w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// QuickStats Component
const QuickStats = ({ data, loading }) => {
  const stats = [
    {
      title: "Active Users",
      value: data.activeUsers,
      subtitle: "Total platform users",
      icon: Users,
      gradient: "from-blue-50 to-blue-500",
      bgGradient: "from-blue-50 to-blue-600",
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: "Tour Guides",
      value: data.activeTourGuides,
      subtitle: "Active guides",
      icon: UserCheck,
      gradient: "from-green-50 to-green-600",
      bgGradient: "from-green-50 to-green-600",
      trend: { value: 3.1, isPositive: true },
    },
    {
      title: "Tourists",
      value: data.activeTourists,
      subtitle: "Active tourists",
      icon: MapPin,
      gradient: "from-purple-50 to-purple-600",
      bgGradient: "from-purple-50 to-purple-600",
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "Vendors",
      value: data.activeVendors,
      subtitle: "Active vendors",
      icon: Store,
      gradient: "from-orange-50 to-orange-600",
      bgGradient: "from-orange-50 to-orange-600",
      trend: { value: -2.3, isPositive: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index}>
          <StatsCard
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            bgGradient={stat.bgGradient}
            loading={loading}
            trend={stat.trend}
          />
        </div>
      ))}
    </div>
  );
};

// RevenueChart Component
const RevenueChart = ({ timeFilter, loading, TimeFilterComponent }) => {
  // Mock data for different time periods
  const getRevenueData = () => {
    switch (timeFilter) {
      case "weekly":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [12000, 15000, 8000, 22000, 18000, 25000, 20000],
          total: 120000,
        };
      case "yearly":
        return {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          values: [180000, 220000, 280000, 350000, 420000],
          total: 1450000,
        };
      default: // monthly
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          values: [
            25000, 30000, 35000, 28000, 42000, 38000, 45000, 50000, 40000,
            35000, 38000, 42000,
          ],
          total: 448000,
        };
    }
  };

  const data = getRevenueData();
  const maxValue = Math.max(...data.values);

  // Create SVG path for the line chart
  const createPath = (values) => {
    const width = 600;
    const height = 200;
    const padding = 40;

    const xStep = (width - 2 * padding) / (values.length - 1);
    const yScale = (height - 2 * padding) / maxValue;

    let path = "";
    values.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - value * yScale;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  // Create area path for gradient fill
  const createAreaPath = (values) => {
    const width = 600;
    const height = 200;
    const padding = 40;

    const xStep = (width - 2 * padding) / (values.length - 1);
    const yScale = (height - 2 * padding) / maxValue;

    let path = `M ${padding} ${height - padding}`;

    values.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - value * yScale;
      path += ` L ${x} ${y}`;
    });

    path += ` L ${padding + (values.length - 1) * xStep} ${height - padding} Z`;
    return path;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
        <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            Revenue Overview
          </h3>
          <p className="text-sm text-gray-600 capitalize mt-1">
            {timeFilter} performance analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-3xl font-bold text-gray-900">
                ${data.total.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-600 font-medium">
                +12.5% growth
              </p>
            </div>
          </div>
          <TimeFilterComponent />
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative bg-gray-50 rounded-xl p-6 border border-gray-100">
        <svg
          width="100%"
          height="300"
          viewBox="0 0 600 250"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={50 + i * 40}
              x2="560"
              y2={50 + i * 40}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area fill */}
          <path d={createAreaPath(data.values)} fill="url(#areaGradient)" />

          {/* Main line */}
          <path
            d={createPath(data.values)}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.values.map((value, index) => {
            const width = 600;
            const height = 200;
            const padding = 40;
            const xStep = (width - 2 * padding) / (data.values.length - 1);
            const yScale = (height - 2 * padding) / maxValue;
            const x = padding + index * xStep;
            const y = height - padding - value * yScale;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="white"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  className="hover:r-8 transition-all duration-200 cursor-pointer"
                />
                <circle cx={x} cy={y} r="3" fill="#3B82F6" />
              </g>
            );
          })}

          {/* Labels */}
          {data.labels.map((label, index) => {
            const width = 600;
            const height = 200;
            const padding = 40;
            const xStep = (width - 2 * padding) / (data.labels.length - 1);
            const x = padding + index * xStep;

            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Hover tooltips */}
        <div className="absolute top-4 right-4 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
          <p className="text-xs text-gray-600">
            Peak: ${Math.max(...data.values).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// SalesChart Component
const SalesChart = ({ timeFilter, loading, TimeFilterComponent }) => {
  // Mock data for package sales
  const getSalesData = () => {
    switch (timeFilter) {
      case "weekly":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [45, 52, 38, 65, 48, 72, 58],
          total: 378,
        };
      case "yearly":
        return {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          values: [1200, 1580, 1920, 2340, 2650],
          total: 9690,
        };
      default: // monthly
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          values: [120, 135, 142, 128, 165, 158, 175, 182, 168, 155, 162, 172],
          total: 1862,
        };
    }
  };

  const data = getSalesData();
  const maxValue = Math.max(...data.values);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center ">
              <Package className="w-5 h-5 text-green-500" />
            </div>
            Package Sales
          </h3>
          <p className="text-sm text-gray-600 capitalize mt-1">
            Audio packages sold - {timeFilter}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {data.total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 justify-end mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-600 font-medium">+8.3% growth</p>
            </div>
          </div>
          <TimeFilterComponent />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="space-y-3">
          {data.values.map((value, index) => (
            <div key={index} className="group">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-gray-700 w-10">
                  {data.labels[index]}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden border border-gray-300">
                  <div
                    className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out relative group-hover:from-green-400 group-hover:to-emerald-400"
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {value}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Average</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.round(data.total / data.values.length)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Peak</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.max(...data.values)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{data.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TopPerformers Component
const TopPerformers = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <Crown className="w-5 h-5 text-yellow-500" />
        </div>
        Top Performers
      </h3>

      <div className="space-y-6">
        {/* Top Tour Guide - Redesigned */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Medal className="w-4 h-4 text-black" />
            <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
              Star Guide
            </h4>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent"></div>
          </div>
          {data.topTourGuide && (
            <div className="relative overflow-hidden bg-blue-900 rounded-2xl border border-yellow-200 group hover:border-yellow-300 transition-all duration-300">
              <div className="relative p-6">
                {/* Header with avatar and crown */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-2xl">
                      <img
                        src={
                          data.topTourGuide.avatar ||
                          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                        }
                        alt={data.topTourGuide.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>
                    {/* Crown badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                      <Crown className="w-4 h-4 text-yellow-800" />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 animate-pulse"></div>
                  </div>

                  <div className="flex-1">
                    <h5 className="font-black text-white text-xl mb-2">
                      {data.topTourGuide.name}
                    </h5>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-sm font-bold text-yellow-700">
                          {data.topTourGuide.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">
                          Top Rated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 group-hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                        Tours
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      {data.topTourGuide.tours}
                    </p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 group-hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                        Revenue
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      ${data.topTourGuide.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Generated</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Most Sold Package - Redesigned */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-black" />
            <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
              Best Seller
            </h4>
            <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-transparent"></div>
          </div>
          {data.mostSoldPackage && (
            <div className="relative overflow-hidden bg-blue-900  rounded-2xl border border-green-200 group hover:border-green-300 transition-all duration-300">
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h5 className="font-black text-white text-xl mb-2">
                      {data.mostSoldPackage.name}
                    </h5>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">
                          +{data.mostSoldPackage.growth || 15.2}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">
                          Hot
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 group-hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                        Sold
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      {data.mostSoldPackage.sold}
                    </p>
                    <p className="text-xs text-gray-600">Units</p>
                  </div>
                  <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 group-hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                        Revenue
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      ${data.mostSoldPackage.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [revenueTimeFilter, setRevenueTimeFilter] = useState("monthly");
  const [salesTimeFilter, setSalesTimeFilter] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeUsers: 0,
    activeTourGuides: 0,
    activeTourists: 0,
    activeVendors: 0,
    totalRevenue: 0,
    totalPackagesSold: 0,
    topTourGuide: null,
    mostSoldPackage: null,
  });

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setDashboardData({
          activeUsers: 2847,
          activeTourGuides: 156,
          activeTourists: 1891,
          activeVendors: 89,
          totalRevenue: 284750,
          totalPackagesSold: 1432,
          topTourGuide: {
            name: "Sarah Johnson",
            tours: 89,
            rating: 4.9,
            revenue: 15420,
            avatar:
              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
          },
          mostSoldPackage: {
            name: "Historic City Tour",
            sold: 234,
            revenue: 23400,
            growth: 15.2,
          },
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const timeFilterOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const TimeFilterButtons = ({
    timeFilter,
    setTimeFilter,
    variant = "default",
  }) => (
    <div
      className={`flex rounded-lg p-1 ${
        variant === "revenue"
          ? "bg-blue-50 border border-blue-200"
          : "bg-green-50 border border-green-200"
      }`}
    >
      {timeFilterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTimeFilter(option.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            timeFilter === option.value
              ? variant === "revenue"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-green-600 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6 max-w-7xl mx-auto">
        {/* Enhanced Header with Distinctive Title */}
        <div className="mb-8">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-xl opacity-50"></div>

            {/* Main header content */}
            <div className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Title section */}
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">
                      <span className="text-gray-900">ADMIN DASHBOARD</span>
                    </h1>
                    <p className="text-gray-600 text-lg font-medium">
                      Real-time insights and business analytics
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 text-sm font-medium">
                          Live Data
                        </span>
                      </div>
                      <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-500 text-sm">
                        Last updated: Just now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side metrics */}
                <div className="flex items-center gap-4">
                  {/* Revenue Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-gray-600 text-sm font-medium">
                      Today's Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900">$12,847</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm font-medium">
                        +8.2%
                      </span>
                    </div>
                  </div>
                  
                  {/* Tour Packages Button */}
                  <button 
                    className="group bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl p-4 border border-emerald-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => window.location.href = '/admin/tourpackage'}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-white" />
                      <p className="text-white text-sm font-semibold">
                        Tour Packages
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-white">247</p>
                      <div className="flex items-center gap-1">
                        <Plus className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                        <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                          Manage
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <ArrowUpRight className="w-3 h-3 text-white/80" />
                      <span className="text-white/80 text-xs font-medium">
                        +12.5%
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats data={dashboardData} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart
              timeFilter={revenueTimeFilter}
              loading={loading}
              TimeFilterComponent={() => (
                <TimeFilterButtons
                  timeFilter={revenueTimeFilter}
                  setTimeFilter={setRevenueTimeFilter}
                  variant="revenue"
                />
              )}
            />

            {/* Three Square Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Card 1 - Total Revenue */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ${dashboardData.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Packages Sold */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Packages Sold
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {dashboardData.totalPackagesSold.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      +8.3%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Avg Rating */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Avg Rating
                  </p>
                  <p className="text-lg font-bold text-gray-900">4.8</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      +0.2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="lg:col-span-1">
            <TopPerformers data={dashboardData} loading={loading} />
          </div>
        </div>

        {/* Sales Chart */}
        <div className="grid grid-cols-1 gap-8">
          <div>
            <SalesChart
              timeFilter={salesTimeFilter}
              loading={loading}
              TimeFilterComponent={() => (
                <TimeFilterButtons
                  timeFilter={salesTimeFilter}
                  setTimeFilter={setSalesTimeFilter}
                  variant="sales"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;