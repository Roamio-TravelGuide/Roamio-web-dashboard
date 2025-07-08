import React from 'react';
import { FaUser, FaUserTie, FaUserShield, FaStore, FaChartLine, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  // Admin Dashboard Stats (mock data)
  const dashboardStats = [
    { title: 'Total Users', value: '1,234', change: '+12%', icon: <FaUser className="text-blue-500" /> },
    { title: 'Active Guides', value: '256', change: '+5%', icon: <FaUserTie className="text-green-500" /> },
    { title: 'Pending Complaints', value: '24', change: '-3%', icon: <FaUserShield className="text-yellow-500" /> },
    { title: 'Total Revenue', value: '$12,345', change: '+18%', icon: <FaStore className="text-purple-500" /> },
  ];

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Admin Overview</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className="p-2 bg-blue-50 rounded-full mr-3">
                <FaUser className="text-blue-500 text-sm" />
              </div>
              <div>
                <p className="font-medium">New user registration</p>
                <p className="text-sm text-gray-500">User #{item} registered 2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaUserTie className="text-blue-500 mb-2" />
            <span>Manage Guides</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaUserShield className="text-green-500 mb-2" />
            <span>Review Complaints</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaStore className="text-purple-500 mb-2" />
            <span>Vendor Approvals</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaCog className="text-gray-500 mb-2" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;