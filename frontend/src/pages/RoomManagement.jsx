import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBook, FaEdit, FaTrash, FaSearch, FaBuilding, FaUsers, FaChalkboardTeacher, FaSnowflake, FaDesktop, FaVolumeUp, FaLightbulb, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const RoomManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: 1,
    capacity: 10,
    type: 'classroom',
    baseRatePerHour: 10,
    electricityRatePerKWh: 0.15,
    facilities: {
      hasProjector: false,
      hasWhiteboard: true,
      hasComputers: false,
      numberOfComputers: 0,
      hasAirConditioner: false,
      numberOfAC: 0,
      acPowerConsumption: 1500,
      numberOfLights: 4,
      lightPowerConsumption: 60,
      hasAudioSystem: false,
      audioSystemPowerConsumption: 200
    }
  });
  
  // Redirect if not pemimpin
  if (user && user.role !== 'pemimpin') {
    navigate('/unauthorized');
    return null;
  }
  
  useEffect(() => {
    fetchRooms();
  }, []);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/room/list');
      setRooms(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('facilities.')) {
      const facilityName = name.split('.')[1];
      setFormData({
        ...formData,
        facilities: {
          ...formData.facilities,
          [facilityName]: type === 'checkbox' ? checked : parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      });
    }
  };
  
  const openCreateModal = () => {
    setFormData({
      roomNumber: '',
      building: '',
      floor: 1,
      capacity: 10,
      type: 'classroom',
      baseRatePerHour: 10,
      electricityRatePerKWh: 0.15,
      facilities: {
        hasProjector: false,
        hasWhiteboard: true,
        hasComputers: false,
        numberOfComputers: 0,
        hasAirConditioner: false,
        numberOfAC: 0,
        acPowerConsumption: 1500,
        numberOfLights: 4,
        lightPowerConsumption: 60,
        hasAudioSystem: false,
        audioSystemPowerConsumption: 200
      }
    });
    setModalMode('create');
    setShowModal(true);
  };
  
  const openEditModal = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      baseRatePerHour: room.baseRatePerHour,
      electricityRatePerKWh: room.electricityRatePerKWh,
      facilities: { ...room.facilities }
    });
    setModalMode('edit');
    setShowModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.roomNumber || !formData.building) {
      toast.error('Room number and building are required');
      return;
    }
    
    try {
      if (modalMode === 'create') {
        await api.post('/api/room/create', formData);
        toast.success('Room created successfully');
      } else {
        await api.put(`/api/room/${selectedRoom._id}`, formData);
        toast.success('Room updated successfully');
      }
      
      setShowModal(false);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(error.response?.data?.message || 'Failed to save room');
    }
  };
  
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    
    try {
      await api.delete(`/api/room/${roomId}`);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      
      if (error.response?.status === 400 && error.response?.data?.bookingsCount) {
        toast.error(`Cannot delete room with ${error.response.data.bookingsCount} existing bookings`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete room');
      }
    }
  };
  
  const filteredRooms = rooms.filter(room => {
    return (
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Room Management</h1>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Create Room
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search rooms by number, building, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      {/* Room List */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
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
                  
                  <div className="flex items-center">
                    <FaBuilding className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Floor: {room.floor}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.facilities.hasProjector && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <FaChalkboardTeacher className="mr-1" />
                        Projector
                      </span>
                    )}
                    {room.facilities.hasAirConditioner && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <FaSnowflake className="mr-1" />
                        AC ({room.facilities.numberOfAC})
                      </span>
                    )}
                    {room.facilities.hasComputers && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <FaDesktop className="mr-1" />
                        Computers ({room.facilities.numberOfComputers})
                      </span>
                    )}
                    {room.facilities.hasAudioSystem && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <FaVolumeUp className="mr-1" />
                        Audio
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-400"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-400"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No rooms found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? `No rooms match "${searchTerm}".` : 'You haven\'t created any rooms yet.'}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Room
          </button>
        </div>
      )}
      
      {/* Create/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      {modalMode === 'create' ? 'Create New Room' : 'Edit Room'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Room Number*
                            </label>
                            <input
                              type="text"
                              id="roomNumber"
                              name="roomNumber"
                              value={formData.roomNumber}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="building" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Building*
                            </label>
                            <input
                              type="text"
                              id="building"
                              name="building"
                              value={formData.building}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Floor
                            </label>
                            <input
                              type="number"
                              id="floor"
                              name="floor"
                              value={formData.floor}
                              onChange={handleInputChange}
                              min="1"
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Capacity
                            </label>
                            <input
                              type="number"
                              id="capacity"
                              name="capacity"
                              value={formData.capacity}
                              onChange={handleInputChange}
                              min="1"
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Room Type
                            </label>
                            <select
                              id="type"
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            >
                              <option value="classroom">Classroom</option>
                              <option value="laboratory">Laboratory</option>
                              <option value="conference">Conference Room</option>
                              <option value="auditorium">Auditorium</option>
                              <option value="study">Study Room</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="baseRatePerHour" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Base Rate ($/hour)
                            </label>
                            <input
                              type="number"
                              id="baseRatePerHour"
                              name="baseRatePerHour"
                              value={formData.baseRatePerHour}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="electricityRatePerKWh" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              Electricity Rate ($/kWh)
                            </label>
                            <input
                              type="number"
                              id="electricityRatePerKWh"
                              name="electricityRatePerKWh"
                              value={formData.electricityRatePerKWh}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Facilities</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="hasProjector"
                                name="facilities.hasProjector"
                                checked={formData.facilities.hasProjector}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                              />
                              <label htmlFor="hasProjector" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Has Projector
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="hasWhiteboard"
                                name="facilities.hasWhiteboard"
                                checked={formData.facilities.hasWhiteboard}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                              />
                              <label htmlFor="hasWhiteboard" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Has Whiteboard
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="hasAirConditioner"
                                name="facilities.hasAirConditioner"
                                checked={formData.facilities.hasAirConditioner}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                              />
                              <label htmlFor="hasAirConditioner" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Has Air Conditioner
                              </label>
                            </div>
                            
                            {formData.facilities.hasAirConditioner && (
                              <>
                                <div>
                                  <label htmlFor="numberOfAC" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Number of AC Units
                                  </label>
                                  <input
                                    type="number"
                                    id="numberOfAC"
                                    name="facilities.numberOfAC"
                                    value={formData.facilities.numberOfAC}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="acPowerConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    AC Power (Watts)
                                  </label>
                                  <input
                                    type="number"
                                    id="acPowerConsumption"
                                    name="facilities.acPowerConsumption"
                                    value={formData.facilities.acPowerConsumption}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  />
                                </div>
                              </>
                            )}
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="hasComputers"
                                name="facilities.hasComputers"
                                checked={formData.facilities.hasComputers}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                              />
                              <label htmlFor="hasComputers" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Has Computers
                              </label>
                            </div>
                            
                            {formData.facilities.hasComputers && (
                              <div>
                                <label htmlFor="numberOfComputers" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Number of Computers
                                </label>
                                <input
                                  type="number"
                                  id="numberOfComputers"
                                  name="facilities.numberOfComputers"
                                  value={formData.facilities.numberOfComputers}
                                  onChange={handleInputChange}
                                  min="1"
                                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="hasAudioSystem"
                                name="facilities.hasAudioSystem"
                                checked={formData.facilities.hasAudioSystem}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                              />
                              <label htmlFor="hasAudioSystem" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Has Audio System
                              </label>
                            </div>
                            
                            {formData.facilities.hasAudioSystem && (
                              <div>
                                <label htmlFor="audioSystemPowerConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Audio System Power (Watts)
                                </label>
                                <input
                                  type="number"
                                  id="audioSystemPowerConsumption"
                                  name="facilities.audioSystemPowerConsumption"
                                  value={formData.facilities.audioSystemPowerConsumption}
                                  onChange={handleInputChange}
                                  min="0"
                                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                            )}
                            
                            <div>
                              <label htmlFor="numberOfLights" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Number of Lights
                              </label>
                              <input
                                type="number"
                                id="numberOfLights"
                                name="facilities.numberOfLights"
                                value={formData.facilities.numberOfLights}
                                onChange={handleInputChange}
                                min="1"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="lightPowerConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Light Power (Watts)
                              </label>
                              <input
                                type="number"
                                id="lightPowerConsumption"
                                name="facilities.lightPowerConsumption"
                                value={formData.facilities.lightPowerConsumption}
                                onChange={handleInputChange}
                                min="0"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default RoomManagement;