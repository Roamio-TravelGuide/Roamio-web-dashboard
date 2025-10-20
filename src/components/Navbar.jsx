import { Link, useLocation, useNavigate } from 'react-router-dom';
import { menuConfig } from '../utils/menuConfig';
import { FaSignOutAlt } from 'react-icons/fa';
import { FiBell } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast'; 

const Navbar = ({ userType, user, onLogout }) => {
  const config = menuConfig[userType];
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  // Minimal logging for debugging
  // console.log('Navbar userType:', userType, 'user:', user?.name);
  
  if (!config || !config.navItems) {
    console.error(`No menu configuration found for user type: ${userType}`);
    return null;
  }
  
  const location = useLocation();
  const activeColorClass = "bg-gradient-to-r from-teal-500 to-blue-500 text-white";
  const inactiveColorClass = "text-gray-700 hover:bg-gray-50";
  const logoutButtonClass = "flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-100 rounded-lg border border-gray-200";

  // Fetch notifications for guides - AUTO FETCH
  useEffect(() => {
    console.log('useEffect triggered with:', { userType, userId: user?.id, userName: user?.name });
    
    // Check if user is a guide (including Sarah Williams special case)
    const isGuide = (userType === 'guide' || userType === 'Travel_guide' || user?.role?.toLowerCase().includes('guide'));
    const hasUserId = user?.id || user?.name === 'Sarah Williams';
    
    if (isGuide && hasUserId) {
      console.log('Auto-calling fetchNotifications for guide...');
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      console.log('Not a guide or no user identifier, skipping notifications');
    }
  }, [userType, user?.id, user?.name]);

  // Handle click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchNotifications = async () => {
    // console.log('Fetching notifications for user:', user?.name);
    
    // Try to get user ID from localStorage if not in props
    let userId = user?.id;
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id;
          console.log('Got user ID from localStorage:', userId);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
    
    // Temporary fix: If user is Sarah Williams, use ID 1
    if (!userId && user?.name === 'Sarah Williams') {
      userId = 1;
    }
    
    if (!userId) {
      console.warn('No user ID available for fetching notifications');
      return;
    }
    
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/notifications/guide/${userId}`;
      const authToken = localStorage.getItem('authToken');
      
      // Create headers - skip auth for now to test
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(apiUrl, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setUnreadCount(data.data?.filter(n => !n.read).length || 0);
      } else {
        console.warn('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Remove the notification from dropdown after clicking
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    
    setShowNotifications(false);
    
    // Navigate based on notification type
    if (notification.type === 'tour_approved' || notification.type === 'tour_rejected') {
      navigate('/guide/tours');
    }
  };

  const handleMarkAllAsRead = async () => {
    const userId = user?.id || (user?.name === 'Sarah Williams' ? 1 : null);
    if (!userId) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/guide/${userId}/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear all notifications from dropdown and reset count
        setNotifications([]);
        setUnreadCount(0);
        
        // Show success message
        console.log('All notifications marked as read and cleared');
        
        // Optional: Close the dropdown after clearing
        setTimeout(() => {
          setShowNotifications(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove the notification from dropdown instead of just marking as read
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

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

            {/* Notification Bell - Show for guides */}
            {(userType === 'guide' || userType === 'Travel_guide' || user?.role?.toLowerCase().includes('guide')) && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-100 relative"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onClick={() => handleNotificationClick(notification)}
                          />
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <FiBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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

// NotificationItem component
const NotificationItem = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'tour_approved':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'tour_rejected':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
    }
  };

  const getStatusColor = () => {
    switch (notification.type) {
      case 'tour_approved':
        return 'text-green-600';
      case 'tour_rejected':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {notification.type === 'tour_approved' && 'Tour Approved'}
              {notification.type === 'tour_rejected' && 'Tour Rejected'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-gray-700 mt-1">
            {notification.message}
          </p>
          {!notification.read && (
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-blue-600 font-medium">New</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;