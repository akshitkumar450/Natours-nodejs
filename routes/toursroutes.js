const express = require('express');
const router = express.Router();
const {
  getAllTour, getTourById, createNewTour, deleteTour, updateTour, aliasTopTous, getTourStats, getMonthlyPlan,
} = require('../controllers/tourController');

// to allow only users which are login to see all tours
const { protect, restrictTo } = require('./../controllers/authControllers')


router.get('/top-5-cheap', aliasTopTous, getAllTour);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);


router.get('/', protect, getAllTour);
router.get('/:id', getTourById);

// while creating new user check it has name  or not if not send 400 error request
//checkbody is a middleware ,which check whether a new user has a name or not
router.post('/', createNewTour);
// deleting of the tour cant be done by any ,,only specific person are allowed to delete the tour
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteTour);
router.patch('/:id', updateTour);

module.exports = router;
