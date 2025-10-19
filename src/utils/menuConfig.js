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
  FaWallet,
  FaCalendarAlt,
  FaBullhorn,
  FaRegClock,
  FaRegStar,
  FaRegQuestionCircle,
} from "react-icons/fa";
import React from "react";
import { icons } from "lucide-react";

// Helper function to create icon elements
const createIcon = (IconComponent) =>
  React.createElement(IconComponent, { className: "w-5 h-5" });

export const menuConfig = {
  travel_guide: {
    navItems: [
      {
        title: "Dashboard",
        path: "/guide/dashboard",
        icon: createIcon(FaChartLine),
      },
      {
        title: "Tours",
        path: "/guide/tourpackages",
        icon: createIcon(FaMapMarkedAlt),
      },
      // {
      //   title: "Creat Tours",
      //   path: "/guide/tourcreate",
      //   icon: createIcon(FaMapMarkedAlt),
      // },
      {
        title: "Earnings",
        path: "/guide/earnings",
        icon: createIcon(FaWallet),
      },
      {
        title: "Support",
        path: "/guide/support",
        icon: createIcon(FaRegQuestionCircle),
      },
      
    ],
  },
  moderator: {
    navItems: [
      {
        title: "Tours",
        path: "/moderator/dashboard",
        icon: createIcon(FaMapMarkedAlt),
      },
      {
        title: "Hidden Gems",
        path: "/moderator/hiddengem",
        icon: createIcon(FaRegStar),
      }
    ],
  },
  admin: {
    navItems: [
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: createIcon(FaChartLine),
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
    ],
  },
  vendor: {
    navItems: [
      {
        title: "Dashboard",
        path: "/vendor/dashboard",
        icon: createIcon(FaChartLine),
      },

      {
        title: "Location",
        path: "/vendor/location",
        icon: createIcon(FaMapMarkedAlt),
      },
      // {
      //   title: "Promotions",
      //   path: "/vendor/promotions",
      //   icon: createIcon(FaBullhorn),
      // },
      {
        title: "Support",
        path: "/vendor/support",
        icon: createIcon(FaRegQuestionCircle),
      },
      {
        title: "Billing",
        path: "/vendor/billing",
        icon: createIcon(FaWallet),
      },
    ],
  },
};
