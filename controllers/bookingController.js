const Tour = require('../models/tourModel');
const ApiErrors = require('../utils/apiErrors');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.getCheckOutSession = catchAsyncError(async (req, res, next) => {

    // 1) get the currently booked tour
    const tour = await Tour.findById(req.params.tourId)

    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.user.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
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