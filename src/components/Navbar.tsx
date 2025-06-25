// src/components/Navbar/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { menuConfig } from '../utils/menuConfig';

interface NavbarProps {
  userType: 'travel_guide' | 'admin' | 'moderator' | 'vendor';
  user: {
    name: string;
    role: string;
    avatar: string;
  };
}

const Navbar = ({ userType, user }: NavbarProps) => {
  const config = menuConfig[userType];
  const location = useLocation();
  const activeColorClass = "bg-gradient-to-r from-teal-600 to-blue-600 text-white";
  const inactiveColorClass = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left side - User info */}
          <div className="flex items-center gap-4">
            <img
              className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
              src={user.avatar}
              alt={`${user.name}'s profile`}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="items-center hidden space-x-1 md:flex">
            {config.navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith(item.path) 
                    ? activeColorClass 
                    : inactiveColorClass
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className="flex py-2 overflow-x-auto md:hidden scrollbar-hide">
          <div className="flex px-2 space-x-2">
            {config.navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                  location.pathname.startsWith(item.path)
                    ? `${activeColorClass} shadow-md`
                    : inactiveColorClass
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;