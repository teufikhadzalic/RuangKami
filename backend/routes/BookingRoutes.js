const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/BookingController")
const auth = require("../middleware/Auth") // Perhatikan huruf kapital 'A' di Auth
const { hasRole } = require("../middleware/roleAuth")

// PENTING: Pastikan semua handler yang digunakan ada di BookingController.js

// Calculate booking cost
router.post("/calculate", auth, hasRole("pemimpin", "pemimpin_divisi"), bookingController.calculateBookingCost)

// Get bookings for schedule - PINDAHKAN SEBELUM ROUTE DENGAN PARAMETER
router.get("/for-schedule", auth, bookingController.getBookingsForSchedule)

// Get all bookings with stats (only for pemimpin) - PINDAHKAN SEBELUM ROUTE DENGAN PARAMETER
router.get("/all-with-stats", auth, hasRole("pemimpin"), bookingController.getAllBookingsWithStats)

// Get all bookings (GET /all)
router.get("/all", auth, bookingController.getAllBookings)

// Get bookings for a user (GET /)
router.get("/", auth, bookingController.getUserBookings)

// Create a booking (POST /create)
router.post("/create", auth, hasRole("pemimpin", "pemimpin_divisi"), bookingController.createBooking)

// Create a new booking (POST /)
router.post("/", auth, bookingController.createBooking)

// Get booking by ID - HARUS SETELAH SEMUA ROUTE KHUSUS
router.get("/:id", auth, bookingController.getBookingById)

// Update booking by ID
router.put("/:id", auth, bookingController.updateBooking)

// Delete booking by ID
router.delete("/:id", auth, bookingController.deleteBooking)

// Cancel booking
router.post("/:id/cancel", auth, bookingController.cancelBooking)

module.exports = router
