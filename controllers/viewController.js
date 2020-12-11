const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('../models/bookingModel');
const catchasyn = require('./../utils/catchAsyncError');
const ApiError = require('./../utils/apiErrors')

exports.getOverView = catchasyn(async (req, res, next) => {
  // 1  get tour data from Db
  const tours = await Tour.find();
  // 2 build template
  // 3 render that template using tour data from 1


  res.status(200).render('overview', {
    title: 'all tours',
    // tours is an array of all tours
    tours: tours,
  });
});

exports.getTour = catchasyn(async (req, res, next) => {
  // 1) get the data ,for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'rating review user',
  });

  if (!tour) {
    return next(new ApiError('there is no tour with that name', 404))
  }
  // 2) build the template
  // 3) redner the template data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour: tour,
  });
});

exports.loginForm = catchasyn(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
})

exports.getAccount = catchasyn(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'your account'
  })

})

exports.updateUser = catchasyn(async (req, res, next) => {
  // id will be coming from the currrent login user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    // req.body.name, and req.body.email is coming from the form that we are submitting bcz it haas name field 
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  })
  // after changing the data we want to load that page again. with updated user sending to account template
  res.status(200).render('account', {
    title: 'your account',
    user: updatedUser
  })
})

//  this fn will get all tours booked by a user
exports.getMyTour = catchasyn(async (req, res, next) => {
  //  find the bookings with the login user which will  give the tour id with that we will get the tour that are booked
  // find all the tours that a user has booked

  //  ** we can use virtual populate also**

  // 1) find all bookings
  const booking = await Booking.find({ user: req.user.id })

  // 2)find tour with returned ids
  // tourIds is an array of tour id with which user has booked tour
  const tourIds = booking.map(el => el.tour)
  // $in will find all the tours with the id in the tourIds array
  const tours = await Tour.find({ _id: { $in: tourIds } })
  res.status(200).render('overview', {
    title: 'my bookings',
    tours: tours
  })
})

exports.alerts = (req, res, next) => {
  const alert = req.query.alert
  if (alert === 'booking') {
    res.locals.alert = 'your booking was successful please check you mail for conformation.if your bookings does\'t show immediately ,please come back later '
  }
  next()
}