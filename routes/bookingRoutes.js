const express = require('express');
const router = express.Router();
const { getCheckOutSession, createBooking, getAllBooking, getBooking, updateBooking, deleteBooking } = require('./../controllers/bookingController')
const { protect, restrictTo } = require('./../controllers/authControllers')

router.use(protect)

router.get('/checkout-session/:tourId', getCheckOutSession)

router.use(restrictTo('admin', 'lead-guide'))
router.get('/', getAllBooking)
router.post('/', createBooking)
router.get('/:id', getBooking)
router.delete('/:id', deleteBooking)
router.update('/:id', updateBooking)

module.exports = router;

