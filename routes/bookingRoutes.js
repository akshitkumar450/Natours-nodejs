const express = require('express');
const router = express.Router();
const { getCheckOutSession } = require('./../controllers/bookingController')
const { protect } = require('./../controllers/authControllers')

router.get('/checkout-session/:tourId', protect, getCheckOutSession)

module.exports = router;

