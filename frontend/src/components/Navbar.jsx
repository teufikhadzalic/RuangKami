import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUser } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock user data utk profile di navbar belum intergrasi ke bckend

  
  const user = {
    name: '',
    email: '',
    avatar: null
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New assignment due tomorrow', time: '1 hour ago', read: false },
    { id: 2, text: 'Your room booking has been confirmed', time: '3 hours ago', read: false },
    { id: 3, text: 'Schedule updated for CS101', time: 'Yesterday', read: true }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-700">RuangKami</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 px-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="py-2">
                        {notifications.map(notification => (
                          <a
                            key={notification.id}
                            href="#"
                            className={`block px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.text}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 px-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 border-t border-gray-200 text-center">
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </a>
                  </div>
                </div>
              )}
            </div>


          
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  {user.avatar ? (
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <FaUser className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
              </button>
              
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;