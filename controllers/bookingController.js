const Tour = require('../models/tourModel');
const User = require('../models/userModel');
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
        success_url: `${req.protocol}://${req.get('host')}/my-tour`,
        // success_url: `${req.protocol}://${req.get('host')}/my-tour/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
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
// exports.createBookingCheckout = catchAsyncError(async (req, res, next) => {
//     //  this is only temporart=y bcz this is less secure 
//     const { tour, price, user } = req.query

//     if (!user & !tour & !price) return next()
//     await Booking.create({ tour, user, price })
//     // redirect to ${req.protocol}://${req.get('host')}/
//     res.redirect(req.originalUrl.split('?')[0])
// })

const createBookingCheckout = async (session) => {
    const tour = session.client_reference_id
    const user = (await User.findOne({ email: session.customer_email })).id
    const price = (session.line_items[0].amount) / 100
    await Booking.create({ tour, user, price })

}

//  this will onyl run when the payment is successful
exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature']
    let event
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK)
    }
    catch (err) {
        return res.status(400).send(`webhook error:${err.message}`)
    }

    if (event.type === 'checkout.session.completed')
        createBookingCheckout(event.data.object)

    res.status(200).json({ recieved: true })
}


exports.createBooking = factory.createOne(Booking)
exports.getAllBooking = factory.getAll(Booking)
exports.getBooking = factory.getOne(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)