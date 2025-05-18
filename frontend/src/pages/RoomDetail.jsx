import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaUsers, FaClock, FaCalendarAlt, FaLightbulb, FaSnowflake, FaDesktop, FaVolumeUp, FaChalkboardTeacher, FaInfoCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    numberOfAttendees: 1,
    division: '',
    usedFacilities: {
      useAC: false,
      numberOfACUsed: 0,
      useLights: true,
      numberOfLightsUsed: 0,
      useProjector: false,
      useAudioSystem: false,
      useComputers: false,
      numberOfComputersUsed: 0
    }
  });
  
  // Cost calculation
  const [costBreakdown, setCostBreakdown] = useState(null);
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // If room data was passed via location state, use it
        if (location.state && location.state.room) {
          setRoom(location.state.room);
          
          // If booking details were also passed, set them in the form
          if (location.state.bookingDetails) {
            setBookingForm(prevForm => ({
              ...prevForm,
              date: location.state.bookingDetails.date,
              startTime: location.state.bookingDetails.startTime,
              endTime: location.state.bookingDetails.endTime,
              usedFacilities: {
                ...prevForm.usedFacilities,
                numberOfLightsUsed: location.state.room.facilities.numberOfLights
              }
            }));
          }
          
          setLoading(false);
        } else {
          // Otherwise, fetch the room data
          const res = await api.get(`/api/room/${id}`);
          setRoom(res.data);
          
          // Initialize the form with default values
          setBookingForm(prevForm => ({
            ...prevForm,
            usedFacilities: {
              ...prevForm.usedFacilities,
              numberOfLightsUsed: res.data.facilities.numberOfLights
            }
          }));
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
        toast.error('Failed to load room details');
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [id, location.state]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('usedFacilities.')) {
      const facilityName = name.split('.')[1];
      setBookingForm({
        ...bookingForm,
        usedFacilities: {
          ...bookingForm.usedFacilities,
          [facilityName]: type === 'checkbox' ? checked : parseInt(value) || 0
        }
      });
    } else {
      setBookingForm({
        ...bookingForm,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      });
    }
    
    // Reset cost calculation when form changes
    setCostBreakdown(null);
  };
  
  const calculateCost = async () => {
    if (!validateForm()) {
      return;
    }
    
    setCalculating(true);
    
    try {
      const res = await api.post('/api/booking/calculate', {
        roomId: room._id,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        usedFacilities: bookingForm.usedFacilities
      });
      
      setCostBreakdown(res.data);
      setCalculating(false);
    } catch (error) {
      console.error('Error calculating cost:', error);
      toast.error('Failed to calculate booking cost');
      setCalculating(false);
    }
  };
  
  const validateForm = () => {
    if (!bookingForm.date) {
      toast.error('Please select a date');
      return false;
    }
    
    if (!bookingForm.startTime || !bookingForm.endTime) {
      toast.error('Please select start and end times');
      return false;
    }
    
    if (bookingForm.startTime >= bookingForm.endTime) {
      toast.error('End time must be after start time');
      return false;
    }
    
    if (!bookingForm.purpose) {
      toast.error('Please enter a purpose for booking');
      return false;
    }
    
    if (!bookingForm.numberOfAttendees || bookingForm.numberOfAttendees < 1) {
      toast.error('Number of attendees must be at least 1');
      return false;
    }
    
    if (bookingForm.numberOfAttendees > room.capacity) {
      toast.error(`Number of attendees cannot exceed room capacity (${room.capacity})`);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!costBreakdown) {
      toast.error('Please calculate the cost first');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // For pemimpin, we need to specify the division
      const division = user.role === 'pemimpin' ? bookingForm.division : user.division;
      
      if (user.role === 'pemimpin' && !division) {
        toast.error('Please select a division');
        setSubmitting(false);
        return;
      }
      
      const bookingData = {
        roomId: room._id,
        date: bookingForm.date,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        purpose: bookingForm.purpose,
        numberOfAttendees: bookingForm.numberOfAttendees,
        division,
        usedFacilities: bookingForm.usedFacilities,
        costBreakdown: {
          baseRate: costBreakdown.baseRate,
          electricityCost: costBreakdown.electricityCost,
          totalCost: costBreakdown.totalCost,
          details: costBreakdown.details
        }
      };
      
      const res = await api.post('/api/booking/create', bookingData);
      
      toast.success('Room booked successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error booking room:', error);
      
      if (error.response && error.response.status === 400 && error.response.data.existingBooking) {
        toast.error('This room is already booked for the selected time slot');
      } else {
        toast.error(error.response?.data?.message || 'Failed to book room');
      }
      
      setSubmitting(false);
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
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/room-booking')}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title mb-0">Book Room: {room.building}, Room {room.roomNumber}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-blue-800 mb-4">Room Details</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center">
                    <FaBuilding className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">{room.building}, Floor {room.floor}</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaUsers className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Capacity:</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">{room.capacity} people</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaInfoCircle className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaInfoCircle className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Base Rate:</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">${room.baseRatePerHour} per hour</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaInfoCircle className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Electricity Rate:</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">${room.electricityRatePerKWh} per kWh</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FaInfoCircle className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Facilities:</span>
                  </div>
                  <ul className="text-sm text-gray-700 ml-6 space-y-1">
                    {room.facilities.hasProjector && (
                      <li className="flex items-center">
                        <FaChalkboardTeacher className="text-blue-600 mr-2" />
                        Projector
                      </li>
                    )}
                    {room.facilities.hasWhiteboard && (
                      <li className="flex items-center">
                        <FaChalkboardTeacher className="text-blue-600 mr-2" />
                        Whiteboard
                      </li>
                    )}
                    {room.facilities.hasAirConditioner && (
                      <li className="flex items-center">
                        <FaSnowflake className="text-blue-600 mr-2" />
                        Air Conditioner ({room.facilities.numberOfAC} units)
                      </li>
                    )}
                    {room.facilities.hasComputers && (
                      <li className="flex items-center">
                        <FaDesktop className="text-blue-600 mr-2" />
                        Computers ({room.facilities.numberOfComputers} units)
                      </li>
                    )}
                    {room.facilities.hasAudioSystem && (
                      <li className="flex items-center">
                        <FaVolumeUp className="text-blue-600 mr-2" />
                        Audio System
                      </li>
                    )}
                    <li className="flex items-center">
                      <FaLightbulb className="text-blue-600 mr-2" />
                      Lights ({room.facilities.numberOfLights} units)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-blue-800 mb-4">Booking Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={bookingForm.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        required
                      />
                    </div>
                  </div>
                  
                  {user.role === 'pemimpin' && (
                    <div>
                      <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                        Division*
                      </label>
                      <select
                        id="division"
                        name="division"
                        value={bookingForm.division}
                        onChange={handleInputChange}
                        className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        required
                      >
                        <option value="">Select Division</option>
                        <option value="art">Art</option>
                        <option value="sports">Sports</option>
                        <option value="academics">Academics</option>
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={bookingForm.startTime}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={bookingForm.endTime}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose*
                    </label>
                    <input
                      type="text"
                      id="purpose"
                      name="purpose"
                      value={bookingForm.purpose}
                      onChange={handleInputChange}
                      placeholder="Meeting, Class, Event, etc."
                      className="pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="numberOfAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Attendees*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUsers className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="numberOfAttendees"
                        name="numberOfAttendees"
                        value={bookingForm.numberOfAttendees}
                        onChange={handleInputChange}
                        min="1"
                        max={room.capacity}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-md font-medium text-blue-800 mb-3">Facilities to Use</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {room.facilities.hasAirConditioner && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useAC"
                        name="usedFacilities.useAC"
                        checked={bookingForm.usedFacilities.useAC}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useAC" className="ml-2 block text-sm text-gray-700">
                        Use Air Conditioner
                      </label>
                    </div>
                  )}
                  
                  {bookingForm.usedFacilities.useAC && room.facilities.hasAirConditioner && (
                    <div>
                      <label htmlFor="numberOfACUsed" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of AC Units
                      </label>
                      <input
                        type="number"
                        id="numberOfACUsed"
                        name="usedFacilities.numberOfACUsed"
                        value={bookingForm.usedFacilities.numberOfACUsed}
                        onChange={handleInputChange}
                        min="0"
                        max={room.facilities.numberOfAC}
                        className="pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useLights"
                      name="usedFacilities.useLights"
                      checked={bookingForm.usedFacilities.useLights}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useLights" className="ml-2 block text-sm text-gray-700">
                      Use Lights
                    </label>
                  </div>
                  
                  {bookingForm.usedFacilities.useLights && (
                    <div>
                      <label htmlFor="numberOfLightsUsed" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Lights
                      </label>
                      <input
                        type="number"
                        id="numberOfLightsUsed"
                        name="usedFacilities.numberOfLightsUsed"
                        value={bookingForm.usedFacilities.numberOfLightsUsed}
                        onChange={handleInputChange}
                        min="0"
                        max={room.facilities.numberOfLights}
                        className="pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                      />
                    </div>
                  )}
                  
                  {room.facilities.hasProjector && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useProjector"
                        name="usedFacilities.useProjector"
                        checked={bookingForm.usedFacilities.useProjector}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useProjector" className="ml-2 block text-sm text-gray-700">
                        Use Projector
                      </label>
                    </div>
                  )}
                  
                  {room.facilities.hasAudioSystem && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useAudioSystem"
                        name="usedFacilities.useAudioSystem"
                        checked={bookingForm.usedFacilities.useAudioSystem}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useAudioSystem" className="ml-2 block text-sm text-gray-700">
                        Use Audio System
                      </label>
                    </div>
                  )}
                  
                  {room.facilities.hasComputers && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useComputers"
                        name="usedFacilities.useComputers"
                        checked={bookingForm.usedFacilities.useComputers}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useComputers" className="ml-2 block text-sm text-gray-700">
                        Use Computers
                      </label>
                    </div>
                  )}
                  
                  {bookingForm.usedFacilities.useComputers && room.facilities.hasComputers && (
                    <div>
                      <label htmlFor="numberOfComputersUsed" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Computers
                      </label>
                      <input
                        type="number"
                        id="numberOfComputersUsed"
                        name="usedFacilities.numberOfComputersUsed"
                        value={bookingForm.usedFacilities.numberOfComputersUsed}
                        onChange={handleInputChange}
                        min="0"
                        max={room.facilities.numberOfComputers}
                        className="pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full"
                      />
                    </div>
                  )}
                </div>
                
                {/* Cost Calculation */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={calculateCost}
                    disabled={calculating}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {calculating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </>
                    ) : 'Calculate Cost'}
                  </button>
                </div>
                
                {costBreakdown && (
                  <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <h3 className="text-md font-medium text-blue-800 mb-3">Cost Breakdown</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Base Rate:</span>
                        <span className="text-sm font-medium text-gray-700">${costBreakdown.baseRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Electricity Cost:</span>
                        <span className="text-sm font-medium text-gray-700">${costBreakdown.electricityCost.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Cost:</span>
                          <span className="text-sm font-medium text-blue-800">${costBreakdown.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <p>Duration: {costBreakdown.details.durationHours.toFixed(2)} hours</p>
                        <p>Electricity Consumption: {costBreakdown.details.electricityConsumptionKWh.toFixed(2)} kWh</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/room-booking')}
                    className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !costBreakdown}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : 'Book Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;