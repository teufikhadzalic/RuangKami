import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaInfoCircle, FaMoneyBillWave, FaTimesCircle, FaCreditCard, FaReceipt } from 'react-icons/fa';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate the data
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock booking data
        const mockBooking = {
          _id: id,
          roomId: {
            _id: '2',
            roomNumber: '203',
            building: 'Building A',
            floor: 2,
            type: 'conference',
            facilities: {
              hasProjector: true,
              hasWhiteboard: true,
              hasComputers: false,
              numberOfComputers: 0,
              hasAirConditioner: true,
              numberOfAC: 1,
              acPowerConsumption: 1500,
              numberOfLights: 6,
              lightPowerConsumption: 60,
              hasAudioSystem: true,
              audioSystemPowerConsumption: 200
            }
          },
          date: new Date('2025-05-22'),
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Team Presentation Practice',
          numberOfAttendees: 5,
          status: 'pending',
          paymentStatus: 'pending',
          totalCost: 150,
          costBreakdown: {
            baseRate: 120,
            electricityCost: 30,
            details: {
              durationHours: 2,
              electricityConsumptionKWh: 4.2
            }
          },
          usedFacilities: {
            useAC: true,
            numberOfACUsed: 1,
            useLights: true,
            numberOfLightsUsed: 6,
            useProjector: true,
            useAudioSystem: true,
            useComputers: false,
            numberOfComputersUsed: 0
          },
          createdAt: new Date('2025-05-16T15:45:00')
        };
        
        setBooking(mockBooking);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);
  
  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    
    setCancelling(true);
    
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate the cancellation
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the booking status
      setBooking({
        ...booking,
        status: 'cancelled',
        cancellationReason,
        paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : 'cancelled'
      });
      
      setShowCancelModal(false);
      setCancellationReason('');
      setCancelling(false);
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      setCancelling(false);
    }
  };
  
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate the payment
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the booking payment status
      setBooking({
        ...booking,
        paymentStatus: 'paid',
        status: booking.status === 'pending' ? 'confirmed' : booking.status
      });
      
      setShowPaymentModal(false);
      setProcessing(false);
      
      toast.success('Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
      setProcessing(false);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending Approval
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  const getPaymentStatusBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Payment Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Refunded
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Payment Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  const canCancel = () => {
    return booking.status !== 'cancelled' && new Date(booking.date) > new Date();
  };
  
  const canPay = () => {
    return booking.paymentStatus === 'pending' && booking.status !== 'cancelled';
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
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/my-bookings')}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title mb-0">Booking Details</h1>
      </div>
      
      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
        booking.status === 'confirmed' ? 'bg-green-100' :
        booking.status === 'pending' ? 'bg-yellow-100' :
        'bg-red-100'
      }`}>
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-4 ${
            booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
            booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
            'bg-red-200 text-red-800'
          }`}>
            {booking.status === 'confirmed' ? (
              <FaCheckCircle className="h-6 w-6" />
            ) : booking.status === 'pending' ? (
              <FaHourglassHalf className="h-6 w-6" />
            ) : (
              <FaTimesCircle className="h-6 w-6" />
            )}
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              booking.status === 'confirmed' ? 'text-green-800' :
              booking.status === 'pending' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {booking.status === 'confirmed' ? 'Booking Confirmed' :
               booking.status === 'pending' ? 'Booking Pending Approval' :
               'Booking Cancelled'}
            </h2>
            <p className="text-sm">
              {booking.status === 'confirmed' ? 'Your room has been reserved for the requested time.' :
               booking.status === 'pending' ? 'Your booking is waiting for approval.' :
               `Cancelled: ${booking.cancellationReason}`}
            </p>
          </div>
        </div>
        <div>
          {canCancel() && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="btn-danger"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Booking Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Room Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        {booking.roomId.building}, Room {booking.roomId.roomNumber}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaInfoCircle className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        {booking.roomId.type.charAt(0).toUpperCase() + booking.roomId.type.slice(1)} Room
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        {formatDate(booking.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        {booking.numberOfAttendees} {booking.numberOfAttendees === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Purpose</h3>
                <p className="text-gray-700">{booking.purpose}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Facilities Used</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking.usedFacilities.useAC && (
                    <div className="flex items-center">
                      <FaSnowflake className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        Air Conditioner ({booking.usedFacilities.numberOfACUsed})
                      </span>
                    </div>
                  )}
                  {booking.usedFacilities.useLights && (
                    <div className="flex items-center">
                      <FaLightbulb className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        Lights ({booking.usedFacilities.numberOfLightsUsed})
                      </span>
                    </div>
                  )}
                  {booking.usedFacilities.useProjector && (
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="text-blue-600 mr-2" />
                      <span className="text-gray-700">Projector</span>
                    </div>
                  )}
                  {booking.usedFacilities.useAudioSystem && (
                    <div className="flex items-center">
                      <FaVolumeUp className="text-blue-600 mr-2" />
                      <span className="text-gray-700">Audio System</span>
                    </div>
                  )}
                  {booking.usedFacilities.useComputers && (
                    <div className="flex items-center">
                      <FaDesktop className="text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        Computers ({booking.usedFacilities.numberOfComputersUsed})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Payment Information</h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Status:</span>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
                
                {booking.paymentStatus === 'paid' && (
                  <div className="text-sm text-gray-500">
                    Paid on {formatDateTime(new Date())}
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Breakdown</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Base Rate ({booking.costBreakdown.details.durationHours} hours):</span>
                    <span className="text-gray-700">${booking.costBreakdown.baseRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Electricity ({booking.costBreakdown.details.electricityConsumptionKWh.toFixed(2)} kWh):</span>
                    <span className="text-gray-700">${booking.costBreakdown.electricityCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>${booking.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {canPay() && (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <FaMoneyBillWave className="mr-2" />
                  Pay Now
                </button>
              )}
              
              {booking.paymentStatus === 'paid' && (
                <button 
                  className="btn-secondary w-full flex items-center justify-center mt-2"
                >
                  <FaReceipt className="mr-2" />
                  Download Receipt
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Booking Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="rounded-full h-8 w-8 bg-blue-500 flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="h-full border-l border-blue-500 ml-4 my-2"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Created</h3>
                    <p className="text-xs text-gray-500">{formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>
                
                {booking.status === 'confirmed' && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 bg-green-500 flex items-center justify-center text-white">
                        <FaCheckCircle />
                      </div>
                      <div className="h-full border-l border-green-500 ml-4 my-2"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Booking Confirmed</h3>
                      <p className="text-xs text-gray-500">{formatDateTime(new Date())}</p>
                    </div>
                  </div>
                )}
                
                {booking.paymentStatus === 'paid' && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 bg-green-500 flex items-center justify-center text-white">
                        <FaMoneyBillWave />
                      </div>
                      {booking.status !== 'cancelled' && (
                        <div className="h-full border-l border-green-500 ml-4 my-2"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Payment Completed</h3>
                      <p className="text-xs text-gray-500">{formatDateTime(new Date())}</p>
                    </div>
                  </div>
                )}
                
                {booking.status === 'cancelled' && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 bg-red-500 flex items-center justify-center text-white">
                        <FaTimesCircle />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Booking Cancelled</h3>
                      <p className="text-xs text-gray-500">{formatDateTime(new Date())}</p>
                      <p className="text-xs text-gray-700 mt-1">Reason: {booking.cancellationReason}</p>
                    </div>
                  </div>
                )}
                
                {booking.status !== 'cancelled' && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 bg-gray-300 flex items-center justify-center text-white">
                        <FaCalendarAlt />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Booking Date</h3>
                      <p className="text-xs text-gray-500">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTimesCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700">
                          Reason for Cancellation
                        </label>
                        <textarea
                          id="cancellationReason"
                          name="cancellationReason"
                          rows={3}
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Please provide a reason for cancellation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {cancelling ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Confirm Cancellation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaCreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Payment Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Complete your payment to confirm your booking.
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                          <span className="text-sm font-bold text-gray-900">${booking.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="credit_card"
                              name="paymentMethod"
                              type="radio"
                              value="credit_card"
                              checked={paymentMethod === 'credit_card'}
                              onChange={() => setPaymentMethod('credit_card')}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                              Credit Card
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="paypal"
                              name="paymentMethod"
                              type="radio"
                              value="paypal"
                              checked={paymentMethod === 'paypal'}
                              onChange={() => setPaymentMethod('paypal')}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                              PayPal
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="bank_transfer"
                              name="paymentMethod"
                              type="radio"
                              value="bank_transfer"
                              checked={paymentMethod === 'bank_transfer'}
                              onChange={() => setPaymentMethod('bank_transfer')}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor="bank_transfer" className="ml-3 block text-sm font-medium text-gray-700">
                              Bank Transfer
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {paymentMethod === 'credit_card' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="card_number" className="block text-sm font-medium text-gray-700">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="card_number"
                              placeholder="1234 5678 9012 3456"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiry_date"
                                placeholder="MM/YY"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="123"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="card_name" className="block text-sm font-medium text-gray-700">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              id="card_name"
                              placeholder="John Doe"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : `Pay $${booking.totalCost.toFixed(2)}`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;