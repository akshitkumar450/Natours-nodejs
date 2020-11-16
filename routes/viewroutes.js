const express = require('express');
const router = express.Router();

const { getTour, getOverView } = require('./../controllers/viewController');

router.get('/', getOverView);
router.get('/tour', getTour);

module.exports = router;
