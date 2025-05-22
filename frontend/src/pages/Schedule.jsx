import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaChartBar, FaListAlt, FaBuilding, FaUser, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('calendar');
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  useEffect(() => {
    fetchBookingsForSchedule();
  }, [dateRange]);
  
  useEffect(() => {
    if (activeTab === 'history' && user && user.role === 'pemimpin') {
      fetchBookingHistory();
    }
  }, [activeTab, user]); // Updated to use the entire user object
  
  const fetchBookingsForSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/booking/for-schedule', {
        params: dateRange
      });
      setBookings(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule bookings:', error);
      toast.error('Failed to load schedule');
      setBookings([]);
      setLoading(false);
    }
  };
  
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/booking/all-with-stats');
      setBookingStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Failed to load booking history');
      setLoading(false);
    }
  };
  
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const renderCalendarView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (!bookings || bookings.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">
            There are no bookings scheduled for the selected date range.
          </p>
          {user && (user.role === 'pemimpin' || user.role === 'pemimpin_divisi') && (
            <Link 
              to="/room-booking"
              className="btn-primary inline-block"
            >
              Book a Room
            </Link>
          )}
        </div>
      );
    }
    
    // Group bookings by date
    const bookingsByDate = bookings.reduce((acc, booking) => {
      if (!booking || !booking.date) return acc;
      const dateKey = new Date(booking.date).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(booking);
      return acc;
    }, {});
    
    return (
      <div className="space-y-6">
        {Object.entries(bookingsByDate).map(([date, dayBookings]) => (
          <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <h3 className="text-lg font-medium text-blue-800">
                {formatDate(date)}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {dayBookings.map(booking => (
                  <div key={booking._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-blue-800">
                          {booking.roomId && `${booking.roomId.building}, Room ${booking.roomId.roomNumber}`}
                        </h4>
                        <p className="text-sm text-gray-600">{booking.purpose}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm font-medium text-gray-700">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaUser className="mr-1" />
                        {booking.userId && booking.userId.name}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaBuilding className="mr-1" />
                        {booking.division && (booking.division.charAt(0).toUpperCase() + booking.division.slice(1))}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <FaUser className="mr-1" />
                        {booking.numberOfAttendees} attendees
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderHistoryView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (!bookingStats || !bookingStats.bookings || bookingStats.bookings.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No booking history found</h3>
          <p className="text-gray-500">
            There are no bookings in the system yet.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* User Booking Statistics */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">
              User Booking Statistics
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Bookings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingStats.userStats && bookingStats.userStats.map(stat => (
                    <tr key={stat._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium">{stat.name && stat.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                            <div className="text-sm text-gray-500">{stat.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {stat.role === 'pemimpin' ? 'Pemimpin' : 
                           stat.role === 'pemimpin_divisi' ? 'Pemimpin Divisi' : 'Anggota Divisi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.division ? stat.division.charAt(0).toUpperCase() + stat.division.slice(1) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${stat.totalCost ? stat.totalCost.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Division Booking Statistics */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">
              Division Booking Statistics
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Bookings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingStats.divisionStats && bookingStats.divisionStats.map(stat => (
                    <tr key={stat._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {stat._id && (stat._id.charAt(0).toUpperCase() + stat._id.slice(1))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${stat.totalCost ? stat.totalCost.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* All Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">
              All Bookings
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingStats.bookings && bookingStats.bookings.map(booking => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.roomId ? `${booking.roomId.building}, Room ${booking.roomId.roomNumber}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.userId ? booking.userId.name : 'N/A'}</div>
                        <div className="text-xs text-gray-500">{booking.userId ? booking.userId.email : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.division ? booking.division.charAt(0).toUpperCase() + booking.division.slice(1) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.status === 'confirmed' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : booking.status === 'pending' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${booking.totalCost ? booking.totalCost.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="page-title">Schedule & Booking History</h1>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCalendarAlt className="inline-block mr-2" />
              Calendar View
            </button>
            
            {user && user.role === 'pemimpin' && (
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaChartBar className="inline-block mr-2" />
                Booking History & Statistics
              </button>
            )}
          </nav>
        </div>
      </div>
      
      {/* Calendar View Filters */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-2">Date Range:</span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                />
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Render Active Tab */}
      {activeTab === 'calendar' ? renderCalendarView() : renderHistoryView()}
    </div>
  );
};

export default Schedule;
