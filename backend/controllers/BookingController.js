const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// Calculate booking cost
exports.calculateBookingCost = async (req, res) => {
  try {
    const { roomId, startTime, endTime, usedFacilities } = req.body;
    
    // Validate input
    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Room ID, start time, and end time are required' });
    }
    
    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Calculate duration in hours
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    const durationHours = (endMinutes - startMinutes) / 60;
    
    // Calculate base cost
    const baseCost = room.baseRatePerHour * durationHours;
    
    // Calculate electricity pemakain
    let totalWattage = 0;
    
    if (usedFacilities.useAC) {
      const acCount = Math.min(
        usedFacilities.numberOfACUsed,
        room.facilities.numberOfAC
      );
      totalWattage += acCount * room.facilities.acPowerConsumption;
    }
    
    if (usedFacilities.useLights) {
      const lightsCount = Math.min(
        usedFacilities.numberOfLightsUsed,
        room.facilities.numberOfLights
      );
      totalWattage += lightsCount * room.facilities.lightPowerConsumption;
    }
    
    if (usedFacilities.useProjector && room.facilities.hasProjector) {
      totalWattage += 300; // Estimasi projector consumption
    }
    
    if (usedFacilities.useAudioSystem && room.facilities.hasAudioSystem) {
      totalWattage += room.facilities.audioSystemPowerConsumption;
    }
    
    if (usedFacilities.useComputers && room.facilities.hasComputers) {
      const computerCount = Math.min(
        usedFacilities.numberOfComputersUsed,
        room.facilities.numberOfComputers
      );
      totalWattage += computerCount * 200; // Estimated computer consumption
    }
    
    // Convert watt-hours to kilowatt-hours
    const electricityConsumption = (totalWattage * durationHours) / 1000;
    
    // Calculate electricity cost
    const electricityCost = electricityConsumption * room.electricityRatePerKWh;
    
    // Calculate total cost
    const totalCost = baseCost + electricityCost;
    
    res.json({
      baseRate: parseFloat(baseCost.toFixed(2)),
      electricityCost: parseFloat(electricityCost.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      details: {
        durationHours: parseFloat(durationHours.toFixed(2)),
        electricityConsumptionKWh: parseFloat(electricityConsumption.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Calculate booking cost error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const {
      roomId,
      date,
      startTime,
      endTime,
      purpose,
      numberOfAttendees,
      usedFacilities,
      costBreakdown
    } = req.body;
    
    // Validate input
    if (!roomId || !date || !startTime || !endTime || !purpose || !numberOfAttendees) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room is already booked for the specified time
    const existingBooking = await Booking.findOne({
      roomId,
      date: new Date(date),
      $or: [
        // Booking starts during the requested time
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // Booking encompasses the requested time
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ],
      status: { $ne: 'cancelled' }
    });
    
    if (existingBooking) {
      return res.status(400).json({
        message: 'Room is already booked for this time slot',
        existingBooking
      });
    }
    
    // Get user's division
    let division;
    if (req.user.role === 'pemimpin') {
      // For pemimpin, division must be specified in the request
      if (!req.body.division) {
        return res.status(400).json({ message: 'Division must be specified for pemimpin' });
      }
      division = req.body.division;
    } else {
      // For pemimpin_divisi, use their division
      division = req.user.division;
    }
    
    // Create booking
    const booking = new Booking({
      roomId,
      userId: req.user.id,
      division,
      date: new Date(date),
      startTime,
      endTime,
      purpose,
      numberOfAttendees,
      usedFacilities,
      totalCost: costBreakdown.totalCost,
      costBreakdown
    });
    
    await booking.save();
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    let bookings;
    
    // Pemimpin can see all bookings
    if (req.user.role === 'pemimpin') {
      bookings = await Booking.find()
        .populate('roomId')
        .populate('userId', 'name email role division');
    } 
    // Division leaders can only see bookings for their division
    else if (req.user.role === 'pemimpin_divisi') {
      bookings = await Booking.find({ division: req.user.division })
        .populate('roomId')
        .populate('userId', 'name email role division');
    }
    // Regular users can only see their own bookings
    else {
      bookings = await Booking.find({ userId: req.user.id })
        .populate('roomId')
        .populate('userId', 'name email role division');
    }
    
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId')
      .populate('userId', 'name email role division');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user has access to this booking
    if (req.user.role !== 'pemimpin' && 
        req.user.role !== 'pemimpin_divisi' && 
        booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    if (!cancellationReason) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user has permission to cancel this booking
    if (req.user.role !== 'pemimpin' && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};