const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Get all rooms
exports.listRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('List rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    const { date, startTime, endTime, capacity, type } = req.query;
    
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }
    
    // Find all bookings for the specified date and time range
    const bookings = await Booking.find({
      date: new Date(date),
      $or: [
        // Booking starts during the requested time
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // Booking ends during the requested time
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // Booking encompasses the requested time
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ],
      status: { $ne: 'cancelled' }
    });
    
    // Get IDs of booked rooms
    const bookedRoomIds = bookings.map(booking => booking.roomId);
    
    // Buat query for available rooms
    let query = { _id: { $nin: bookedRoomIds } };
    
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    
    if (type) {
      query.type = type;
    }
    
    // Find available rooms
    const availableRooms = await Room.find(query);
    
    res.json(availableRooms);
  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};