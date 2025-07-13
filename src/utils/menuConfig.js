import {
  FaUsers,
  FaChartLine,
  FaCog,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaWallet,
  FaBullhorn,
  FaRegClock,
  FaRegStar,
  FaRegQuestionCircle,
  
} from "react-icons/fa";
import React from "react";

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
        title: "Complaints",
        path: "/guide/complaints",
        icon: createIcon(FaRegQuestionCircle),
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
