// src/utils/menuConfig.ts
import { 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaUser, 
  FaUserTie, 
  FaUserShield,
  FaStore,
  FaMapMarkedAlt,
  FaWallet
} from 'react-icons/fa';
import React from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  action?: () => void;
  subItems?: MenuItem[];
}

export interface MenuConfig {
  navItems: MenuItem[];
}

// Helper function to create icon elements
const createIcon = (IconComponent: React.ComponentType<{ className?: string }>) => (
  React.createElement(IconComponent, { className: "w-5 h-5" })
);

export const menuConfig: Record<string, MenuConfig> = {
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
  moderator :{
    navItems:[
      {
      title:"Profile",
      path:"/moderator/dashboard",
      icon:createIcon(FaCog),
      }
    ]
  },
  admin: {
    navItems: [
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: createIcon(FaChartLine)
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: createIcon(FaUsers),
      },
      {
        title: "Complaints",
        path: "/admin/complaints",
        icon: createIcon(FaUsers),
      },
    ]
  }
};