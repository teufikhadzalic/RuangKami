import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaUsers, FaLightbulb, FaSnowflake, FaDesktop, FaChalkboardTeacher, FaVolumeUp, FaBook } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FaExclamationCircle } from "react-icons/fa";

const RoomBooking = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    capacity: '',
    type: ''
  });
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Redirect if not pemimpin or pemimpin_divisi
  if (user && user.role !== 'pemimpin' && user.role !== 'pemimpin_divisi') {
    navigate('/unauthorized');
    return null;
  }
  
  const handleSearch = async () => {
    setLoading(true);
    
    try {
      // Validate inputs
      if (!searchParams.date || !searchParams.startTime || !searchParams.endTime) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Validate time
      if (searchParams.startTime >= searchParams.endTime) {
        toast.error('End time must be after start time');
        setLoading(false);
        return;
      }
      
      const res = await api.get('/api/room/available', {
        params: {
          date: searchParams.date,
          startTime: searchParams.startTime,
          endTime: searchParams.endTime,
          capacity: searchParams.capacity || undefined,
          type: searchParams.type || undefined
        }
      });
      
      setRooms(res.data);
      setSearchPerformed(true);
      setLoading(false);
    } catch (error) {
      console.error('Error searching for rooms:', error);
      toast.error('Failed to search for available rooms');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  const getRoomTypeIcon = (type) => {
    switch (type) {
      case 'classroom':
        return <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400" />;
      case 'laboratory':
        return <FaDesktop className="text-green-600 dark:text-green-400" />;
      case 'conference':
        return <FaUsers className="text-purple-600 dark:text-purple-400" />;
      case 'auditorium':
        return <FaUsers className="text-red-600 dark:text-red-400" />;
      case 'study':
        return <FaBook className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400" />;
    }
  };
  
  const formatRoomType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <div>
      <h1 className="page-title">Room Booking</h1>
      
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">Find Available Rooms</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Date*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                value={searchParams.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Start Time*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={searchParams.startTime}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              End Time*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={searchParams.endTime}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Capacity (Min)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUsers className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={searchParams.capacity}
                onChange={handleInputChange}
                min="1"
                placeholder="Any capacity"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Room Type
            </label>
            <select
              id="type"
              name="type"
              value={searchParams.type}
              onChange={handleInputChange}
              className="pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="">Any type</option>
              <option value="classroom">Classroom</option>
              <option value="laboratory">Laboratory</option>
              <option value="conference">Conference Room</option>
              <option value="auditorium">Auditorium</option>
              <option value="study">Study Room</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Search Available Rooms
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Results */}
      {searchPerformed && (
        <div>
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
            Available Rooms for {new Date(searchParams.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} ({searchParams.startTime} - {searchParams.endTime})
          </h2>
          
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room._id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">{room.building}, Room {room.roomNumber}</h3>
                        <div className="flex items-center mt-1">
                          {getRoomTypeIcon(room.type)}
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{formatRoomType(room.type)}</span>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        ${room.baseRatePerHour}/hr
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <FaUsers className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-200">Capacity: {room.capacity} people</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {room.facilities.hasProjector && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <FaChalkboardTeacher className="mr-1" />
                            Projector
                          </span>
                        )}
                        {room.facilities.hasAirConditioner && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <FaSnowflake className="mr-1" />
                            AC
                          </span>
                        )}
                        {room.facilities.hasAudioSystem && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <FaVolumeUp className="mr-1" />
                            Audio
                          </span>
                        )}
                        {room.facilities.hasComputers && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <FaDesktop className="mr-1" />
                            Computers ({room.facilities.numberOfComputers})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/room-booking/${room._id}`}
                      state={{ 
                        room, 
                        bookingDetails: {
                          date: searchParams.date,
                          startTime: searchParams.startTime,
                          endTime: searchParams.endTime
                        }
                      }}
                      className="btn-primary block text-center"
                    >
                      Book This Room
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
              <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No available rooms found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria or selecting a different time slot.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomBooking;