const express = require('express');
const router = express.Router();

const { getTour, getOverView, loginForm } = require('./../controllers/viewController');
const { protect } = require('./../controllers/authControllers');


router.get('/', getOverView);
router.get('/tour/:slug', protect, getTour);
router.get('/login', loginForm);

module.exports = router;
