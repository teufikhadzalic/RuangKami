import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaBook, 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaBookmark,
  FaClipboardList,
  FaUserCircle,
  FaClock
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0 transition duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-200">RuangKami</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden dark:text-gray-300 dark:focus:text-gray-100"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            <FaHome className="nav-link-icon" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/assignments" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaBook className="nav-link-icon" />
            <span>Assignments</span>
          </NavLink>
          
          <NavLink to="/schedule" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaCalendarAlt className="nav-link-icon" />
            <span>Schedule</span>
          </NavLink>
          
          {user && (user.role === 'pemimpin' || user.role === 'pemimpin_divisi') && (
            <>
              <NavLink to="/room-booking" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaDoorOpen className="nav-link-icon" />
                <span>Room Booking</span>
              </NavLink>
              
              <NavLink to="/my-bookings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaBookmark className="nav-link-icon" />
                <span>My Bookings</span>
              </NavLink>
            </>
          )}

          {user && user.role === 'pemimpin' && (
            <NavLink to="/booking-history" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaClock className="nav-link-icon" />
              <span>Booking History</span>
            </NavLink>
          )}

          {user && user.role === 'pemimpin' && (
            <NavLink to="/room-management" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaClipboardList className="nav-link-icon" />
              <span>Room Management</span>
            </NavLink>
          )}
          
          <NavLink to="/profile" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaUserCircle className="nav-link-icon" />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-700 dark:bg-blue-900 flex items-center justify-center text-white">
                <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'pemimpin' ? 'Pemimpin' : 
                 user?.role === 'pemimpin_divisi' ? `Pemimpin Divisi (${user.division})` : 
                 user?.role === 'anggota_divisi' ? `Anggota Divisi (${user.division})` : 'User'}
              </p>
            </div>
            <button 
              onClick={logout}
              className="ml-auto text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;