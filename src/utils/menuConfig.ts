// src/utils/menuConfig.ts
import { FaUsers, FaChartLine, FaCog, FaMapMarkedAlt, FaCalendarAlt, FaWallet } from 'react-icons/fa';
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
        path: "/guide/tours",
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
};