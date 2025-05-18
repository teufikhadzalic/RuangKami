import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUsers, FaBuilding, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/booking');
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleCancelBooking = async (id) => {
    try {
      setCancellingId(id);
      
      const reason = prompt('Please provide a reason for cancellation:');
      if (!reason) {
        setCancellingId(null);
        return;
      }
      
      await api.post(`/api/booking/${id}/cancel`, { cancellationReason: reason });
      
      // Update the booking status in the UI
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status: 'cancelled', cancellationReason: reason } : booking
      ));
      
      toast.success('Booking cancelled successfully');
      setCancellingId(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      setCancellingId(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="page-title">My Bookings</h1>
      
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">
                      {booking.roomId.building}, Room {booking.roomId.roomNumber}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {booking.purpose}
                    </p>
                  </div>
                  
                  <div className="mt-2 md:mt-0">
                    {booking.status === 'confirmed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    ) : booking.status === 'pending' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Date:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{formatDate(booking.date)}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FaClock className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Time:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{booking.startTime} - {booking.endTime}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FaUsers className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Attendees:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{booking.numberOfAttendees} people</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Division:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{booking.division.charAt(0).toUpperCase() + booking.division.slice(1)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t border-gray-200 pt-4">
                  <div className="mb-2 md:mb-0">
                    <span className="text-sm font-medium text-gray-700">Total Cost:</span>
                    <span className="ml-2 text-sm font-medium text-blue-800">${booking.totalCost.toFixed(2)}</span>
                  </div>
                  
                  {booking.status === 'confirmed' && new Date(booking.date) > new Date() && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {cancellingId === booking._id ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FaTrash className="mr-2 h-4 w-4" />
                      )}
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
                
                {booking.status === 'cancelled' && (
                  <div className="mt-4 bg-red-50 p-3 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Cancellation Reason:</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{booking.cancellationReason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">
            You haven't made any room bookings yet.
          </p>
          <Link 
            to="/room-booking"
            className="btn-primary inline-block"
          >
            Book a Room
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;