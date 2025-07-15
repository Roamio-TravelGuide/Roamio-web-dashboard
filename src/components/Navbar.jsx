import { Link, useLocation, useNavigate } from 'react-router-dom';
import { menuConfig } from '../utils/menuConfig';
import { FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast'; 

const Navbar = ({ userType, user, onLogout }) => {
  const config = menuConfig[userType];
  const navigate = useNavigate();
  
  if (!config || !config.navItems) {
    console.error(`No menu configuration found for user type: ${userType}`);
    return null;
  }
  
  const location = useLocation();
  const activeColorClass = "bg-gradient-to-r from-teal-500 to-blue-500 text-white";
  const inactiveColorClass = "text-gray-700 hover:bg-gray-50";
  const logoutButtonClass = "flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-100 rounded-lg border border-gray-200";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto sm:px-6 lg:px-12">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img
              className="object-cover w-10 h-10 border border-gray-200 rounded-full shadow-sm"
              src={user.avatar}
              alt={`${user.name}'s profile`}
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="items-center hidden space-x-1 md:flex">
              {config.navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
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

            <div className="hidden h-6 mx-2 border-l border-gray-200 md:block"></div>

            <button
              onClick={handleLogout}
              className={logoutButtonClass}
            >
              <FaSignOutAlt className="w-4 h-4 text-gray-500" />
              <span className="hidden text-sm font-medium md:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex py-2 overflow-x-auto md:hidden scrollbar-hide">
          <div className="flex px-2 space-x-2">
            {config.navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 text-xs rounded-full whitespace-nowrap ${
                  location.pathname.startsWith(item.path)
                    ? `${activeColorClass} shadow-md`
                    : inactiveColorClass
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-full whitespace-nowrap"
            >
              <FaSignOutAlt className="w-3 h-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;