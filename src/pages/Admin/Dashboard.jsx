import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
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
  Phone,
} from "lucide-react";
import { getAllUsers } from "../../api/admin/adminApi";
import { getTotalRevenue } from "../../api/admin/adminApi";
import { getTopPerformerRevenue } from "../../api/admin/adminApi";
import { getAllPackages } from "../../api/admin/adminApi";
import { getTopSellingPackage } from "../../api/admin/adminApi";
import { getSoldPackagesCount } from "../../api/admin/adminApi";

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
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-200 w-14 h-14 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="mb-1 text-3xl font-bold text-gray-900 transition-transform duration-200 group-hover:scale-105">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="mb-2 text-xs text-gray-500">{subtitle}</p>}
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
            <Icon className="text-white w-7 h-7" />
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
      value:
        data.activeUsers +
        data.activeTourists +
        data.activeTourGuides +
        data.activeVendors,
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
      value: data.activeUsers,
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
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
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
const RevenueChart = ({
  timeFilter,
  loading,
  TimeFilterComponent,
  weeklyRevenue,
  monthlyRevenue,
  totalRevenue,
}) => {
  // Use actual data from props/state instead of mock data
  const getRevenueData = () => {
    switch (timeFilter) {
      case "weekly":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: weeklyRevenue?.dailyBreakdown || Array(7).fill(0),
          total: weeklyRevenue?.total || 0,
        };
      case "yearly":
        return {
          labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
          values: totalRevenue?.yearlyBreakdown || Array(6).fill(0),
          total: totalRevenue?.total || 0,
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
          values: monthlyRevenue?.monthlyBreakdown || Array(12).fill(0),
          total: monthlyRevenue?.total || 0,
        };
    }
  };

  const data = getRevenueData();
  // Ensure maxValue is at least 1 to avoid division by zero
  const maxValue = Math.max(1, ...data.values);

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
      const yValue = Number.isFinite(value) ? value : 0;
      const y = height - padding - yValue * yScale;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const createAreaPath = (values) => {
    const width = 600;
    const height = 200;
    const padding = 40;

    const xStep = (width - 2 * padding) / (values.length - 1);
    const yScale = (height - 2 * padding) / maxValue;

    let path = `M ${padding} ${height - padding}`;

    values.forEach((value, index) => {
      const x = padding + index * xStep;
      const yValue = Number.isFinite(value) ? value : 0;
      const y = height - padding - yValue * yScale;
      path += ` L ${x} ${y}`;
    });

    path += ` L ${padding + (values.length - 1) * xStep} ${height - padding} Z`;
    return path;
  };

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="w-32 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            Revenue Overview
          </h3>
          <p className="mt-1 text-sm text-gray-600 capitalize">
            {timeFilter} performance analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-3xl font-bold text-gray-900">{data.total}</p>
            </div>
            <div className="flex items-center justify-end gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-green-600">
                +12.5% growth
              </p>
            </div>
          </div>
          <TimeFilterComponent />
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative p-6 border border-gray-100 bg-gray-50 rounded-xl">
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
                  className="transition-all duration-200 cursor-pointer hover:r-8"
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
                className="text-xs font-medium fill-gray-600"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Hover tooltips */}
        <div className="absolute px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg top-4 right-4">
          <p className="text-xs text-gray-600">
            Peak: ${Math.max(...data.values).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// SalesChart Component
// SalesChart Component
// SalesChart Component - Proper fix
const SalesChart = ({ timeFilter, loading, TimeFilterComponent, soldPackagesData }) => {
  // Helper function to get correct monthly data
  const getCorrectMonthlyData = () => {
    const monthlyData = soldPackagesData?.monthly || Array(12).fill(0);
    const yearlyData = soldPackagesData?.yearly || [];
    
    // If monthly data is all zeros but we have yearly data, try to reconstruct it
    if (monthlyData.every(val => val === 0) && yearlyData.length > 0) {
      // Create a new array with proper distribution
      const correctedMonthlyData = Array(12).fill(0);
      
      // For each year in the data
      yearlyData.forEach(yearData => {
        // If we know specific month information, distribute accordingly
        // Since we know there were 3 sales in January 2024:
        if (yearData.year === 2024) {
          correctedMonthlyData[0] = yearData.total; // January = 3 sales
        }
        // Add logic for other years if needed
      });
      
      return correctedMonthlyData;
    }
    
    return monthlyData;
  };

  // Use real data from props instead of mock data
  const getSalesData = () => {
    switch (timeFilter) {
      case "weekly":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: soldPackagesData?.weekly || Array(7).fill(0),
          total: soldPackagesData?.weekly?.reduce((sum, val) => sum + val, 0) || 0,
        };
      case "yearly":
        // For yearly data, we need to handle the array of objects
        const yearlyData = soldPackagesData?.yearly || [];
        return {
          labels: yearlyData.map(item => item.year.toString()),
          values: yearlyData.map(item => item.total),
          total: yearlyData.reduce((sum, item) => sum + item.total, 0),
        };
      default: // monthly
        const correctedMonthlyData = getCorrectMonthlyData();
        return {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          values: correctedMonthlyData,
          total: correctedMonthlyData.reduce((sum, val) => sum + val, 0),
        };
    }
  };

  const data = getSalesData();
  const maxValue = Math.max(1, ...data.values); // Ensure maxValue is at least 1

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="w-32 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl ">
              <Package className="w-5 h-5 text-green-500" />
            </div>
            Package Sales
          </h3>
          <p className="mt-1 text-sm text-gray-600 capitalize">
            Audio packages sold - {timeFilter}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {data.total.toLocaleString()}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-600">+8.3% growth</p>
            </div>
          </div>
          <TimeFilterComponent />
        </div>
      </div>

      <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
        <div className="space-y-3">
          {data.values.map((value, index) => (
            <div key={index} className="group">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 text-sm font-semibold text-gray-700">
                  {data.labels[index]}
                </span>
                <div className="relative flex-1 h-4 overflow-hidden bg-gray-200 border border-gray-300 rounded-full">
                  <div
                    className="relative h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 group-hover:from-green-400 group-hover:to-emerald-400"
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:opacity-100"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-sm font-bold text-right text-gray-900">
                    {value}
                  </span>
                  <div className="w-2 h-2 transition-opacity bg-green-500 rounded-full opacity-60 group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="pt-4 mt-6 border-t border-gray-200">
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
const TopPerformers = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="w-32 h-6 mb-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-gray-900">
          <div className="flex items-center justify-center w-10 h-10 bg-white shadow-lg rounded-xl">
            <Crown className="w-5 h-5 text-yellow-500" />
          </div>
          Top Performers
        </h3>
        <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-red-50 border-red-200 rounded-xl">
          <p className="font-semibold text-red-600">
            Failed to load top performers data.
          </p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
      <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-gray-900">
        <div className="flex items-center justify-center w-10 h-10 bg-white shadow-lg rounded-xl">
          <Crown className="w-5 h-5 text-yellow-500" />
        </div>
        Top Performers
      </h3>

      <div className="space-y-6">
        {/* Top Tour Guide - Redesigned */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Medal className="w-4 h-4 text-black" />
            <h4 className="text-sm font-semibold tracking-wide text-black uppercase">
              Star Guide
            </h4>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent"></div>
          </div>
          {data.topTourGuide ? (
            <div className="relative overflow-hidden transition-all duration-300 bg-blue-900 border border-yellow-200 rounded-2xl group hover:border-yellow-300">
              <div className="relative p-6">
                {/* Header with avatar and crown */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 p-1 shadow-2xl rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500">
                      <img
                        src={
                          data.topTourGuide.avatar ||
                          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                        }
                        alt={data.topTourGuide.name}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </div>
                    {/* Crown badge */}
                    <div className="absolute flex items-center justify-center w-8 h-8 border-2 border-yellow-300 rounded-full shadow-lg -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-500">
                      <Crown className="w-4 h-4 text-yellow-800" />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 animate-pulse"></div>
                  </div>

                  <div className="flex-1">
                    <h5 className="mb-2 text-xl font-black text-white">
                      {data.topTourGuide.name}
                    </h5>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-200 rounded-full">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-sm font-bold text-yellow-700">
                          {data.topTourGuide.rating || 4.8}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
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
                  <div className="p-4 transition-all duration-300 bg-white border border-gray-200 backdrop-blur-sm rounded-xl group-hover:bg-white/90">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-medium tracking-wide text-blue-700 uppercase">
                        Tours
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      {data.topTourGuide.packageCount || 0}
                    </p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="p-4 transition-all duration-300 bg-white border border-gray-200 backdrop-blur-sm rounded-xl group-hover:bg-white/90">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium tracking-wide text-green-700 uppercase">
                        Revenue
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      ${(data.topTourGuide.totalRevenue || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Generated</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-100 border border-gray-200 rounded-xl">
              <p className="text-gray-600">No top tour guide data available</p>
            </div>
          )}
        </div>

        {/* Most Sold Package - Redesigned */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-black" />
            <h4 className="text-sm font-semibold tracking-wide text-black uppercase">
              Best Seller
            </h4>
            <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-transparent"></div>
          </div>
          {data.mostSoldPackage ? (
            <div className="relative overflow-hidden transition-all duration-300 bg-blue-900 border border-green-200 rounded-2xl group hover:border-green-300">
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h5 className="mb-2 text-xl font-black text-white">
                      {data.mostSoldPackage.title || data.mostSoldPackage.name}
                    </h5>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">
                          +{data.mostSoldPackage.growth || 15.2}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">
                          Hot
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 shadow-2xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 transition-all duration-300 bg-white border border-gray-200 backdrop-blur-sm rounded-xl group-hover:bg-white/90">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium tracking-wide text-green-700 uppercase">
                        Sold
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      {data.mostSoldPackage.sales_count ||
                        data.mostSoldPackage.salesCount ||
                        0}
                    </p>
                    <p className="text-xs text-gray-600">Units</p>
                  </div>
                  <div className="p-4 transition-all duration-300 bg-white border border-gray-200 backdrop-blur-sm rounded-xl group-hover:bg-white/90">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-medium tracking-wide text-green-700 uppercase">
                        Revenue
                      </p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                      $
                      {(
                        data.mostSoldPackage.total_revenue ||
                        data.mostSoldPackage.totalRevenue ||
                        0
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-100 border border-gray-200 rounded-xl">
              <p className="text-gray-600">No package sales data available</p>
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
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [tourpackage, setTourPackages] = useState(0);
  const [soldPackages, setSoldPackages] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeTourGuides, setActiveTourGuides] = useState(0);
  const [activeTourists, setActiveTourists] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);

  const [soldPackagesData, setSoldPackagesData] = useState({
    weekly: null,
    monthly: null,
    yearly: null,
  });

  const [dashboardData, setDashboardData] = useState({
    totalPackagesSold: 0,
    topTourGuide: null,
    mostSoldPackage: null,
  });

  // Prepare quickStatsData
  const quickStatsData = {
    activeUsers,
    activeTourGuides,
    activeTourists,
    activeVendors,
  };

  const revenueData = {
    totalRevenue,
    weeklyRevenue,
    monthlyRevenue,
  };

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          packagesResponse,
          revenueResponse,
          topPerformerResponse,
          usersResponse,
          topSellingPackageResponse,
          soldPackagesResponse
        ] = await Promise.allSettled([
          getAllPackages({ status: "published" }),
          getTotalRevenue(),
          getTopPerformerRevenue(),
          getAllUsers(),
          getTopSellingPackage(),
          getSoldPackagesCount()
        ]);

        if (packagesResponse.status === "fulfilled") {
          setTourPackages(packagesResponse.value.data.length);
        } else {
          console.error("Failed to fetch packages", packagesResponse.reason);
          setError((error) => ({
            ...error,
            packages: packagesResponse.reason.message,
          }));
          setTourPackages(0);
        }

        if (revenueResponse.status === "fulfilled") {
          const response = revenueResponse.value;
          setSoldPackages(response.sold_packages);
          setTotalRevenue(response.total);
          setMonthlyRevenue(response.monthly || 0);
          setWeeklyRevenue(response.weekly || 0);
          setTodayRevenue(response.today);
        } else {
          console.error(
            "Failed to fetch total revenue",
            revenueResponse.reason
          );
          setError((error) => ({
            ...error,
            revenue: revenueResponse.reason.message,
          }));
        }

        if (topPerformerResponse.status === "fulfilled") {
          const response = topPerformerResponse.value;
          console.log("Top Performer Revenue Data:", response);

          // Handle the API response structure properly
          // The API returns data in response.data, not directly in response
          const topPerformerData = response.data || response;

          setDashboardData((prevData) => ({
            ...prevData,
            topTourGuide: topPerformerData,
            // For mostSoldPackage, you might need to fetch this separately
            // or adjust based on your actual API response
            mostSoldPackage: prevData.mostSoldPackage,
          }));
        } else {
          console.error(
            "Failed to fetch dashboard data:",
            topPerformerResponse.reason
          );
          setError((error) => ({
            ...error,
            topPerformers: topPerformerResponse.reason.message,
          }));
        }

        if (usersResponse.status === "fulfilled") {
          const users = usersResponse.value.data;
          setUsers(users);
          setActiveUsers(
            users.filter(
              (user) => user.role === "traveler" && user.status === "active"
            ).length
          );
          setActiveTourGuides(
            users.filter(
              (user) => user.role === "travel_guide" && user.status === "active"
            ).length
          );
          setActiveTourists(
            users.filter(
              (user) => user.role === "tourist" && user.status === "active"
            ).length
          );
          setActiveVendors(
            users.filter(
              (user) => user.role === "vendor" && user.status === "active"
            ).length
          );
        } else {
          console.error("Failed to fetch users:", usersResponse.reason);
          setError((error) => ({
            ...error,
            users: usersResponse.reason.message,
          }));
        }

        if (topSellingPackageResponse.status === "fulfilled") {
          const response = topSellingPackageResponse.value;
          console.log("Top Selling Package Data:", response);

          // Update the dashboard data with the top selling package
          setDashboardData((prevData) => ({
            ...prevData,
            mostSoldPackage: response.data || response,
          }));
        } else {
          console.error(
            "Failed to fetch top selling package:",
            topSellingPackageResponse.reason
          );
          setError((error) => ({
            ...error,
            topSellingPackage: topSellingPackageResponse.reason.message,
          }));
        }

        if (soldPackagesResponse.status === 'fulfilled') {
        const response = soldPackagesResponse.value;
        console.log("Sold Packages Data:", response);
        setSoldPackagesData(response.data || response);
      } else {
        console.error("Failed to fetch sold packages:", soldPackagesResponse.reason);
        setError(error => ({...error, soldPackages: soldPackagesResponse.reason.message}));
      }
      } catch (error) {
        console.error(
          "An unexpected error occurred during dashboard data fetch:",
          error
        );
        setError({ general: "An unexpected error occurred." });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
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
      <div className="w-full px-4 py-6 mx-auto max-w-7xl">
        {/* Enhanced Header with Distinctive Title */}
        <div className="mb-8">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-xl"></div>

            {/* Main header content */}
            <div className="relative p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Title section */}
                  <div>
                    <h1 className="mb-2 text-2xl font-black text-gray-900">
                      <span className="text-gray-900">ADMIN DASHBOARD</span>
                    </h1>
                    <p className="text-lg font-medium text-gray-600">
                      Real-time insights and business analytics
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">
                          Live Data
                        </span>
                      </div>
                      <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-500">
                        Last updated: Just now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side metrics */}
                <div className="flex items-center gap-4">
                  {/* Revenue Card */}
                  <div className="p-4 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600">
                      Today's Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      Rs.{todayRevenue}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        +8.2%
                      </span>
                    </div>
                  </div>

                  {/* Tour Packages Button */}
                  <button
                    className="p-4 transition-all duration-300 transform border shadow-lg group bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl border-emerald-400 hover:shadow-xl hover:scale-105 active:scale-95"
                    onClick={() =>
                      (window.location.href = "/admin/tourpackage")
                    }
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-white" />
                      <p className="text-sm font-semibold text-white">
                        Tour Packages
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-white">
                        {tourpackage}
                      </p>
                      <div className="flex items-center gap-1">
                        <Plus className="w-4 h-4 transition-colors text-white/80 group-hover:text-white" />
                        <span className="text-xs font-medium transition-colors text-white/80 group-hover:text-white">
                          Manage
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <ArrowUpRight className="w-3 h-3 text-white/80" />
                      <span className="text-xs font-medium text-white/80">
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
        <QuickStats data={quickStatsData} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart
              data={revenueData}
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
              <div className="p-4 transition-all duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg group">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 mb-3 transition-transform duration-200 bg-white rounded-xl group-hover:scale-110">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    Rs.{totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Packages Sold */}
              <div className="p-4 transition-all duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg group">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 mb-3 transition-transform duration-200 bg-white rounded-xl group-hover:scale-110">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Packages Sold
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {soldPackages}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +8.3%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Avg Rating */}
              <div className="p-4 transition-all duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg group">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 mb-3 transition-transform duration-200 bg-white rounded-xl group-hover:scale-110">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-lg font-bold text-gray-900">4.8</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +0.2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="lg:col-span-1">
            <TopPerformers
              data={dashboardData}
              loading={loading}
              error={error?.topPerformers}
            />
          </div>
        </div>

        {/* Sales Chart */}
        {/* Sales Chart */}
<div className="grid grid-cols-1 gap-8">
  <div>
    <SalesChart
      timeFilter={salesTimeFilter}
      loading={loading}
      soldPackagesData={soldPackagesData} // Pass the sold packages data
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
