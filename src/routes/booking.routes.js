const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);

module.exports = router;
