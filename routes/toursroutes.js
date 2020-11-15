const express = require('express');
const router = express.Router();
const {
  getAllTour, getTourById, createNewTour, deleteTour, updateTour, aliasTopTous, getTourStats, getMonthlyPlan, getToursWithin
} = require('../controllers/tourController');

// to allow only users which are login to see all tours
const { protect, restrictTo } = require('./../controllers/authControllers')

const reviewRouter = require('./../routes/reviewroutes')
// const { getAllReviews, createNewReview } = require('./../controllers/reviewControllers')

// nested routes ***************

// POST /tour/25646564sd/reviews
// GET /tour/25646564sd/reviews
// GET /tour/25646564sd/reviews/sd9ds97f

//  here  tour id will come from URL and user id will come from currently logged in user 
// router.post('/:tourId/reviews', protect, restrictTo('user'), createNewReview)

// we have done the refactoring bcz we are doing the work of reviews in tour routes
// and we have put the route here bcz it starts with tour route
// its just a kind of middleware ....
//   we have re routed to reviewRouter just as we have done before in app.js file just mounting the router
router.use('/:tourId/reviews', reviewRouter)

router.get('/top-5-cheap', aliasTopTous, getAllTour);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// ************geoSpatail queries****************

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin)

//  we have delete protect middleware bcz we want anyone to see all tours
router.get('/', getAllTour);
// router.get('/', protect, getAllTour);
router.get('/:id', getTourById);

// while creating new user check it has name  or not if not send 400 error request
//checkbody is a middleware ,which check whether a new user has a name or not
router.post('/', protect, restrictTo('admin', 'lead-guide'), createNewTour);
// deleting of the tour cant be done by any ,,only specific person are allowed to delete the tour
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteTour);
router.patch('/:id', protect, restrictTo('admin', 'lead-guide'), updateTour);

//  updating,creating and deleting tour can only done by loged in user and admin and lead-guide
module.exports = router;
