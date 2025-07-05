import { FaUsers, FaChartLine, FaCog, FaMapMarkedAlt, FaCalendarAlt, FaWallet } from 'react-icons/fa';
import React from 'react';

// Helper function to create icon elements
const createIcon = (IconComponent) => (
  React.createElement(IconComponent, { className: "w-5 h-5" })
);

export const menuConfig = {
  travel_guide: {
    navItems: [
      {
        title: "Dashboard",
        path: "/guide/dashboard",
        icon: createIcon(FaChartLine),
      },
      {
        title: "Creat Tours",
        path: "/guide/tourcreate",
        icon: createIcon(FaMapMarkedAlt),
      },
      {
        title: "Earnings",
        path: "/guide/earnings",
        icon: createIcon(FaWallet),
      },
      {
        title: "Settings",
        path: "/guide/settings",
        icon: createIcon(FaCog),
      },
    ],
  },
  moderator: {
    navItems: [
      {
        title: "Profile",
        path: "/moderator/dashboard",
        icon: createIcon(FaCog),
      }
    ]
  }
};