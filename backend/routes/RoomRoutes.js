const express = require('express');
const router = express.Router();
const roomController = require('../controllers/RoomController');
const auth = require('../middleware/Auth');
const { hasRole } = require('../middleware/roleAuth');
const bookingController = require('../controllers/BookingController');

// Get all rooms
router.get(
  '/list',
  auth,
  hasRole('pemimpin', 'pemimpin_divisi'),
  roomController.listRooms
);

// Get all for now
router.get('/', roomController.listRooms);


// Get available rooms
router.get(
  '/available',
  auth,
  hasRole('pemimpin', 'pemimpin_divisi'),
  roomController.getAvailableRooms
);

// Get room by ID
router.get(
  '/:id',
  auth,
  hasRole('pemimpin', 'pemimpin_divisi'),
  roomController.getRoomById
);

module.exports = router;