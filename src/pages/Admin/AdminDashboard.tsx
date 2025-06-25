import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  Hotel,
  Shield,
  MessageSquare,
  CreditCard,
  Bell,
  ChevronDown,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Activity,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
  gradient?: string;
}

interface PendingItem {
  type: 'certification' | 'application';
  title: string;
  subtitle: string;
  actionType: 'review' | 'approve';
  actionColor: string;
}

interface ActivityItem {
  type: 'success' | 'info' | 'warning';
  text: string;
  time: string;
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { id: 'guides', label: 'Travel Guides', icon: Users },
    { id: 'packages', label: 'Tour Packages', icon: Package },
    { id: 'travelers', label: 'Travelers', icon: UserCheck },
    { id: 'vendors', label: 'Hotel Vendors', icon: Hotel },
    { id: 'moderators', label: 'Moderators', icon: Shield },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const metrics: MetricCard[] = [
    {
    title: 'Total Guides',
    value: '156',
    change: '+12% from last month',
    changeType: 'positive',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Active Travelers',
    value: '2,654',
    change: '+8% from last month',
    changeType: 'positive',
    icon: CheckCircle,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    gradient: 'from-green-400 to-teal-500',
  },
  {
    title: 'Monthly Revenue',
    value: '$89,450.00',
    change: '+15% from last month',
    changeType: 'positive',
    icon: DollarSign,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    gradient: 'from-purple-400 to-fuchsia-500',
  },
  {
    title: 'Pending Complaints',
    value: '7',
    change: '',
    changeType: 'positive',
    icon: MessageSquare,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    gradient: 'from-red-400 to-pink-500',
  }
  ];

  const pendingItems: PendingItem[] = [
    {
      type: 'certification',
      title: 'Guide Certifications',
      subtitle: '5 guides waiting',
      actionType: 'review',
      actionColor: 'bg-orange-500'
    },
    {
      type: 'application',
      title: 'Vendor Applications',
      subtitle: '3 new applications',
      actionType: 'review',
      actionColor: 'bg-blue-500'
    }
  ];

  const recentActivities: ActivityItem[] = [
    {
      type: 'success',
      text: 'Guide Maria Rodriguez completed certification',
      time: '2 hours ago'
    },
    {
      type: 'info',
      text: 'New hotel vendor registered',
      time: '4 hours ago'
    },
    {
      type: 'warning',
      text: 'Complaint resolved for tour package',
      time: '6 hours ago'
    }
  ];

  const systemMetrics: MetricCard[] = [
  {
    title: 'System Uptime',
    value: '98.5%',
    change: '',
    changeType: 'positive',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
    gradient: 'from-green-400 to-green-600',
  },
  {
    title: 'Average Rating',
    value: '4.7',
    change: '',
    changeType: 'positive',
    icon: Star,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    title: 'Total Revenue',
    value: '$1,245,670.00',
    change: '',
    changeType: 'positive',
    icon: DollarSign,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    gradient: 'from-purple-400 to-purple-600',
  }
];


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
       {/* Avatar + Name + Dropdown */}
    <div className="relative">
      <button
        className="flex items-center space-x-3 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <div className="relative w-10 h-10">
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
        <span className="absolute -bottom-0 -right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
      </span>
    </div>
        <div className="text-left">
          <h1 className="text-large font-bold text-gray-900">Admin</h1>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="px-4 py-2 border-b font-semibold text-gray-700">My Account</div>
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Profile Settings</li>
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Preferences</li>
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Security</li>
          </ul>
          <div className="px-4 py-2 text-red-500 hover:bg-gray-50 cursor-pointer border-t">Sign Out</div>
        </div>
      )}
      </div>
      </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left text-base  font-medium transition-colors ${
                item.id === activeSection
                  ? 'bg-blue-50 text-teal-600 border-r-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto ">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700  font-bold text-gray-900 ">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 h-5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            3
            </span>
            </button>
          </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 pt-15" >
          {/* Metrics Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {metrics.map((metric, index) => (
    <div
      key={index}
      className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white/90 backdrop-blur-sm rounded-lg"
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>

      {/* Floating Orbs */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-700"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`p-4 rounded-2xl ${metric.iconBg} group-hover:scale-110 transition-all duration-500 shadow-lg flex items-center justify-center`}>
            <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
          </div>

          {/* Change badge */}
          {metric.change && (
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 mb-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                {metric.change}
              </span>
              
            </div>
          )}
        </div>

        {/* Title and Value */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide">{metric.title}</h3>
          <p className="text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-500">
            {metric.value}
          </p>
        </div>
      </div>
    </div>
  ))} 
</div>




          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-12">
            {/* Pending Approvals */}
            <div className="rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
  <div className="bg-gradient-to-r from-green-400 to-cyan-600 px-8 py-6 flex items-center">
    <div className="bg-white bg-opacity-20 rounded-xl w-14 h-14 flex items-center justify-center mr-5">
      {/* Clock Icon */}
      <svg className="w-8 h-8 text-white opacity-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div>
      <div className="text-white text-2xl font-semibold">Pending Approvals</div>
      <div className="text-white text-sm opacity-80 mt-1">Action required</div>
    </div>
  </div>

  {/* Approval Items */}
  <div className="space-y-4 px-6 py-6 bg-white">
    {/* Guide Certifications */}
    <div className="flex items-center justify-between p-6 rounded-2xl" style={{ background: "#FFF3EA" }}>
      <div className="flex items-center">
        <div className="bg-[#FFB889] rounded-xl w-12 h-12 flex items-center justify-center mr-5">
          {/* Ribbon Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="5" stroke="#FF7B3F" strokeWidth="2" fill="none"/>
            <path d="M12 14v5M12 14l-2 2.5M12 14l2 2.5" stroke="#FF7B3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">Guide Certifications</div>
          <div className="text-sm text-gray-600">5 guides waiting</div>
        </div>
      </div>
      <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-base font-semibold rounded-lg shadow hover:opacity-90 transition-opacity">
        Review <span className="ml-2">&#8594;</span>
      </button>
    </div>
    {/* Vendor Applications */}
    <div className="flex items-center justify-between p-6 rounded-2xl" style={{ background: "#EAF2FF" }}>
      <div className="flex items-center">
        <div className="bg-[#8AB8FF] rounded-xl w-12 h-12 flex items-center justify-center mr-5">
          {/* Building Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="3" width="12" height="16" rx="2" stroke="#2563EB" strokeWidth="2" fill="none"/>
            <rect x="9" y="15" width="2" height="2" fill="#2563EB"/>
            <rect x="13" y="15" width="2" height="2" fill="#2563EB"/>
            <rect x="9" y="11" width="2" height="2" fill="#2563EB"/>
            <rect x="13" y="11" width="2" height="2" fill="#2563EB"/>
            <rect x="9" y="7" width="2" height="2" fill="#2563EB"/>
            <rect x="13" y="7" width="2" height="2" fill="#2563EB"/>
          </svg>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">Vendor Applications</div>
          <div className="text-sm text-gray-600">3 new applications</div>
        </div>
      </div>
      <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-base font-semibold rounded-lg shadow hover:opacity-90 transition-opacity">
        Review <span className="ml-2">&#8594;</span>
      </button>
    </div>
  </div>
</div>


            {/* Recent Activities */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
  {/* Header */}
  <div className="bg-gradient-to-r from-green-500 to-cyan-500 px-8 py-6 flex items-center">
    <div className="bg-green-100 rounded-xl w-14 h-14 flex items-center justify-center mr-5">
      {/* Replace with your desired icon */}
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 20v-6M12 4v4m0 0a4 4 0 1 1-4 4" />
      </svg>
    </div>
    <div>
      <div className="text-white text-2xl font-semibold">Recent Activities</div>
      <div className="text-white text-sm opacity-80 mt-1">Live updates</div>
    </div>
  </div>

  {/* Activities */}
  <div className="bg-white px-8 py-8">
    <div className="space-y-10 relative">
      {recentActivities.map((activity, index) => (
        <div key={index} className="flex items-start relative">
          {/* Vertical line for timeline */}
          {index < recentActivities.length - 1 && (
            <span className="absolute left-6 top-12 h-10 w-0.5 bg-gray-200 z-0"></span>
          )}
          {/* Icon */}
          <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
            ${activity.type === 'success' ? 'bg-green-100' :
              activity.type === 'info' ? 'bg-blue-100' : 'bg-orange-100'}`}>
            {/* Replace with your icons as needed */}
            {activity.type === 'success' && (
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="9" r="5" stroke="#16A34A" strokeWidth="2" fill="none"/>
    <path d="M12 14v5M12 14l-2 2.5M12 14l2 2.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {activity.type === 'info' && (
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="6" y="3" width="12" height="16" rx="2" stroke="#2563EB" strokeWidth="2" fill="none"/>
                <rect x="9" y="15" width="2" height="2" fill="#2563EB"/>
                <rect x="13" y="15" width="2" height="2" fill="#2563EB"/>
                <rect x="9" y="7" width="2" height="2" fill="#2563EB"/>
                <rect x="13" y="7" width="2" height="2" fill="#2563EB"/>

              </svg>
            )}
            {activity.type === 'warning' && (
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
          {/* Content */}
          <div className="ml-6 flex-1">
            <p className="text-base font-semibold text-gray-900">{activity.text}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {activity.time}
              </span>
              <span className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'info' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          </div>

          {/* System Performance */}
          <div className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg overflow-hidden rounded-lg">
  {/* Header */}
  <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-6 relative">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
    <div className="relative z-10 text-white">
      <h2 className="text-2xl font-bold mb-2">System Performance</h2>
      <p className="text-slate-300">Real-time monitoring dashboard</p>
    </div>
  </div>

  {/* Cards */}
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {systemMetrics.map((metric, index) => (
        <div
          key={index}
          className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-xl"
        >
          {/* Animated Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>

          {/* Floating Orbs */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-700"></div>

          {/* Content */}
          <div className="p-6 relative z-10 text-center">
            <div className={`mx-auto mb-4 p-4 rounded-2xl ${metric.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-500 w-fit`}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>

            <h3 className="text-3xl font-bold text-slate-800 mb-2 group-hover:scale-105 transition-transform duration-300">{metric.value}</h3>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          
        
        </div>
      </div>
    </div>
  );
}

export default App;