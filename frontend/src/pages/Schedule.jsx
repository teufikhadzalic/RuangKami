import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBuilding, FaUser, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBookingsForSchedule();
  }, [dateRange]);

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
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
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
          <div key={date} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 border-b border-blue-100 dark:border-blue-900">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                {formatDate(date)}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {dayBookings.map(booking => (
                  <div key={booking._id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200">
                          {booking.roomId && `${booking.roomId.building}, Room ${booking.roomId.roomNumber}`}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.purpose}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        <FaUser className="mr-1" />
                        {booking.userId && booking.userId.name}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        <FaBuilding className="mr-1" />
                        {booking.division && (booking.division.charAt(0).toUpperCase() + booking.division.slice(1))}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
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

  return (
    <div>
      <h1 className="page-title">Schedule</h1>
      {/* Calendar View Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Date Range:</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      {renderCalendarView()}
    </div>
  );
};

export default Schedule;
