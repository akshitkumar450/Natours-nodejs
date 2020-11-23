const express = require('express');
const router = express.Router();

const { getTour, getOverView, loginForm, getAccount, updateUser, getMyTour } = require('./../controllers/viewController');
const { protect, isLoggedIn } = require('./../controllers/authControllers');
const { createBookingCheckour } = require('./../controllers/bookingController');

router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUser)
router.post('/my-tour', protect, getMyTour)

// router.use(isLoggedIn)

router.get('/', createBookingCheckour, isLoggedIn, getOverView);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, loginForm);

module.exports = router;
