// src/utils/menuConfig.ts
import { FaPlus, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import React from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  action?: () => void;
  subItems?: MenuItem[];
}

export interface ActionButtonConfig {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  className: string;
}

export interface MenuConfig {
  navItems: MenuItem[];
  actionButton: ActionButtonConfig;
}

// Helper function to create icon elements
const createIcon = (IconComponent: React.ComponentType<{ className?: string }>, className: string) => (
  React.createElement(IconComponent, { className })
);

export const menuConfig: Record<string, MenuConfig> = {
  travel_guide: {
    navItems: [
      {
        title: "Dashboard",
        path: "/guide/dashboard",
        icon: createIcon(FaChartLine, "w-5 h-5")
      },
      // ... other guide menu items
    ],
    actionButton: {
      title: "Create New Tour",
      icon: createIcon(FaPlus, "w-4 h-4"),
      onClick: () => {}, // This will be overridden by the parent component
      className: "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
    }
  },
};