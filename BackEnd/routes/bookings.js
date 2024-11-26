const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const { auth } = require('../middleware');

// Routes for booking operations
router.post('/', auth, BookingController.createBooking);
// Add more routes as needed
// Example:
// router.get('/:id', auth, BookingController.getBookingById);
// router.put('/:id', auth, BookingController.updateBooking);
// router.delete('/:id', auth, BookingController.deleteBooking);

module.exports = router;
