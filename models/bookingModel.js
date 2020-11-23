const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    // parent referencing
    //  to put the referencing  of user and  tour, user who booked the specific tour
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'booking must belong to a tour']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'booking must belong to a user']
    },
    price: {
        type: Number,
        default: [true, 'booking must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})

//  to populate automatically when there is a query
bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    })
})


const Booking = mongoose.model('Booking', bookingSchema)
module.exports = Booking