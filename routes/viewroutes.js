const express = require('express');
const router = express.Router();

const { getTour, getOverView, login } = require('./../controllers/viewController');

router.get('/', getOverView);
router.get('/tour/:slug', getTour);
router.get('/login', login);

module.exports = router;
