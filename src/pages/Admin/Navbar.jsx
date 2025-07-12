import React from "react";
import PropTypes from 'prop-types';
import {
  BarChart3,
  Users,
  CreditCard,
  MessageSquare,
  User,
  Bell,
} from "lucide-react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "All Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "complaints", label: "Complaints", icon: MessageSquare },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="relative w-11 h-11">
              <img
                src="https://i.pravatar.cc/32?img=3" // Replace with actual profile URL
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 ">Admin</p>
              
            </div>
          </div>
          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-teal-600 to-blue-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-normal text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Right side - Admin profile */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0 -right-0 min-w-[10px] h-[10px] bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center rounded-full px-1"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
