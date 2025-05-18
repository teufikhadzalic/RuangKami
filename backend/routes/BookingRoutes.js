const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');
const auth = require('../middleware/Auth');
const { hasRole } = require('../middleware/roleAuth');

// Calculate booking cost
router.post(
  '/calculate',
  auth,
  hasRole('pemimpin', 'pemimpin_divisi'),
  bookingController.calculateBookingCost
);

// Create a booking
router.post(
  '/create',
  auth,
  hasRole('pemimpin', 'pemimpin_divisi'),
  bookingController.createBooking
);

// Get bookings for a user
router.get(
  '/',
  auth,
  bookingController.getUserBookings
);

// Get booking by ID
router.get(
  '/:id',
  auth,
  bookingController.getBookingById
);

// Cancel booking
router.post(
  '/:id/cancel',
  auth,
  bookingController.cancelBooking
);

module.exports = router;