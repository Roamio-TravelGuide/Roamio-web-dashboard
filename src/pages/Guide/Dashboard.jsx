import React, { useState, useEffect } from "react";
import { FaUsers, FaMoneyCheck, FaRegStar, FaCalendar, FaPlane, FaMapMarker } from "react-icons/fa";
import { Eye, Edit3, MoreHorizontal, Users, Star, MapPin, Calendar, MessageSquare, Activity, TrendingUp, DollarSign, Package, BarChart3, Bell, Search, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data for charts
  const revenueData = [
    { name: 'Sun', value: 200 },
    { name: 'Mon', value: 300 },
    { name: 'Tue', value: 250 },
    { name: 'Wed', value: 400 },
    { name: 'Thu', value: 350 },
    { name: 'Fri', value: 450 },
    { name: 'Sat', value: 380 }
  ];

  const destinationData = [
    { name: 'Tokyo, Japan', value: 35, color: '#3B82F6' },
    { name: 'Sydney, Australia', value: 28, color: '#10B981' },
    { name: 'Paris, France', value: 22, color: '#F59E0B' },
    { name: 'Venice, Italy', value: 15, color: '#EF4444' }
  ];

  const travelPackages = [
    {
      id: 1,
      name: 'Seoul, South Korea',
      duration: '7 Days',
      price: 2100,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      status: 'Hot Deal'
    },
    {
      id: 2,
      name: 'Venice, Italy',
      duration: '5 Days',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?w=300&h=200&fit=crop',
      status: 'New Deal'
    },
    {
      id: 3,
      name: 'Serengeti, Tanzania',
      duration: '6 Days',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=200&fit=crop',
      status: 'Hot Deal'
    }
  ];

  const recentBookings = [
    { id: 1, name: 'Camelia Swan', package: 'Venice Dreams', duration: '5D4N', date: 'Jun 25 - Jun 30', price: 1500, status: 'Confirmed' },
    { id: 2, name: 'Raphael Goodman', package: 'Safari Adventure', duration: '6D7N', date: 'Jun 25 - Jul 2', price: 3200, status: 'Pending' },
    { id: 3, name: 'Ludvig Contessa', package: 'Alpine Escape', duration: '7D6N', date: 'Jun 25 - Jul 2', price: 2100, status: 'Confirmed' },
    { id: 4, name: 'Arminia Raul Meyes', package: 'Caribbean Cruise', duration: '10D9N', date: 'Jun 30 - Jul 9', price: 2800, status: 'Confirmed' }
  ];

  const messages = [
    { id: 1, name: 'Europa Hotel', message: 'New booking received', time: '2m ago', avatar: '🏨' },
    { id: 2, name: 'Global Travel Co', message: 'Payment confirmed for Julia', time: '5m ago', avatar: '✈️' },
    { id: 3, name: 'Kalendra Umbara', message: 'Hi, I need assistance with...', time: '8m ago', avatar: '👤' },
    { id: 4, name: 'Osman Farooq', message: 'Package has been updated', time: '12m ago', avatar: '📦' }
  ];

  const upcomingTrips = [
    { id: 1, destination: 'Paris, France', date: 'Jul 15 - Jul 20', participants: 4, image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=60&h=60&fit=crop' },
    { id: 2, destination: 'Tokyo, Japan', date: 'Jul 22 - Jul 28', participants: 6, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=60&h=60&fit=crop' },
    { id: 3, destination: 'Sydney, Australia', date: 'Aug 5 - Aug 12', participants: 3, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop' }
  ];

  const recentActivity = [
    { id: 1, user: 'Alberto Cortez', action: 'updated his profile and added a new tour', time: '2h ago' },
    { id: 2, user: 'Camelia Swan', action: 'booked the Venice Dreams package', time: '4h ago' },
    { id: 3, user: 'Payment', action: 'was processed for Ludwig Contessa Alpine Escape', time: '6h ago' },
    { id: 4, user: 'Arminia Raul Meyes', action: 'cancelled her Caribbean Cruise Package', time: '8h ago' }
  ];

  // Calendar logic
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    
    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`prev-${i}`} className="p-2 text-gray-400"></div>);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                     selectedMonth === new Date().getMonth() && 
                     selectedYear === new Date().getFullYear();
      
      days.push(
        <div 
          key={day} 
          className={`p-2 text-sm cursor-pointer hover:bg-blue-50 rounded ${
            isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
          <div className="text-lg font-medium text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Booking</p>
              <p className="text-2xl font-bold text-gray-900">1,200</p>
              <p className="text-sm text-green-600">+2.58%</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total New Customers</p>
              <p className="text-2xl font-bold text-gray-900">2,845</p>
              <p className="text-sm text-red-600">-1.45%</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$12,890</p>
              <p className="text-sm text-green-600">+3.75%</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-3">
          {/* Revenue Overview */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded">Weekly</button>
                <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">Monthly</button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Travel Packages */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Travel Packages</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {travelPackages.map((pkg) => (
                <div key={pkg.id} className="overflow-hidden border rounded-lg">
                  <img src={pkg.image} alt={pkg.name} className="object-cover w-full h-32" />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                    <p className="text-sm text-gray-600">{pkg.duration}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(pkg.price)}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        pkg.status === 'Hot Deal' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Name</th>
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Package</th>
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Duration</th>
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Date</th>
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Price</th>
                    <th className="py-2 text-sm font-medium text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{booking.name}</td>
                      <td className="py-3 text-sm text-gray-600">{booking.package}</td>
                      <td className="py-3 text-sm text-gray-600">{booking.duration}</td>
                      <td className="py-3 text-sm text-gray-600">{booking.date}</td>
                      <td className="py-3 text-sm text-gray-900">{formatCurrency(booking.price)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">July 2025</h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-xs font-medium text-gray-600">{day}</div>
              ))}
              {renderCalendar()}
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Trips</h3>
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center p-3 space-x-3 rounded-lg bg-gray-50">
                  <img src={trip.image} alt={trip.destination} className="object-cover w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{trip.destination}</h4>
                    <p className="text-sm text-gray-600">{trip.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{trip.participants} participants</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Messages</h3>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm">{message.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{message.name}</h4>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;