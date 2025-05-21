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


//newww
// Create a new room (only pemimpin)
exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      building,
      floor,
      capacity,
      type,
      facilities,
      baseRatePerHour,
      electricityRatePerKWh
    } = req.body;
    
    // Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber, building });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room with this number already exists in this building' });
    }
    
    // Create new room
    const room = new Room({
      roomNumber,
      building,
      floor,
      capacity,
      type,
      facilities,
      baseRatePerHour,
      electricityRatePerKWh
    });
    
    await room.save();
    
    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a room (only pemimpin)
exports.updateRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      building,
      floor,
      capacity,
      type,
      facilities,
      baseRatePerHour,
      electricityRatePerKWh
    } = req.body;
    
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if new room number already exists (if changed)
    if (roomNumber !== room.roomNumber || building !== room.building) {
      const existingRoom = await Room.findOne({ 
        roomNumber, 
        building,
        _id: { $ne: req.params.id }
      });
      
      if (existingRoom) {
        return res.status(400).json({ message: 'Room with this number already exists in this building' });
      }
    }
    
    // Update room
    room.roomNumber = roomNumber;
    room.building = building;
    room.floor = floor;
    room.capacity = capacity;
    room.type = type;
    room.facilities = facilities;
    room.baseRatePerHour = baseRatePerHour;
    room.electricityRatePerKWh = electricityRatePerKWh;
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a room (only pemimpin)
exports.deleteRoom = async (req, res) => {
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room has bookings
    const bookings = await Booking.find({ roomId: req.params.id });
    if (bookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with existing bookings',
        bookingsCount: bookings.length
      });
    }
    
    await room.remove();
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

///new