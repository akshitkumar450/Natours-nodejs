const express = require('express');
const router = express.Router();

const { getTour, getOverView, loginForm } = require('./../controllers/viewController');
const { protect, isLoggedIn } = require('./../controllers/authControllers');

router.use(isLoggedIn)

router.get('/', getOverView);
router.get('/tour/:slug', getTour);
router.get('/login', loginForm);

module.exports = router;
