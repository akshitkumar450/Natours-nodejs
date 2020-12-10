const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const ApiErrors = require('../utils/apiErrors');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.getCheckOutSession = catchAsyncError(async (req, res, next) => {

    // 1) get the currently booked tour
    const tour = await Tour.findById(req.params.tourId)

    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                //  images should be lived images (deployed)
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'INR',
                quantity: 1
            }
        ]
    })
    // 3) send the session to client

    res.status(200).json({
        status: 'success',
        session: session
    })

})

//  when a successful payment is done with stripe we will go to  ${req.protocol}://${req.get('host')}/
//  we will add this middleware to viewRoutes in getOverview middleware
exports.createBookingCheckour = catchAsyncError(async (req, res, next) => {
    //  this is only temporart=y bcz this is less secure 
    const { tour, price, user } = req.query

    if (!user & !tour & !price) return next()
    await Booking.create({ tour, user, price })
    // redirect to ${req.protocol}://${req.get('host')}/
    res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = factory.createOne(Booking)
exports.getAllBooking = factory.getAll(Booking)
exports.getBooking = factory.getOne(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)