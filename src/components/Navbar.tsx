// src/components/Navbar/Navbar.tsx
import { Link } from 'react-router-dom';
import { menuConfig } from '../utils/menuConfig';

interface NavbarProps {
  userType: 'travel_guide' | 'admin' | 'moderator' | 'vendor';
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  onActionButtonClick?: () => void;
}

const Navbar = ({ userType, user, onActionButtonClick }: NavbarProps) => {
  const config = menuConfig[userType];

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

          {/* Right side - Action button */}
          <button
            onClick={onActionButtonClick || config.actionButton.onClick}
            className={`flex items-center gap-2 px-4 py-2 text-white transition-all duration-200 rounded-lg shadow-md ${config.actionButton.className}`}
          >
            {config.actionButton.icon}
            {config.actionButton.title}
          </button>
        </div>

        {/* Mobile menu would go here */}
      </div>
    </div>
  );
};

export default Navbar;