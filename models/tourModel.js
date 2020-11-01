const mongoose = require('mongoose')
// defining a schema for our tours
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour name is missing'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'a tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'must have a difficulty']
    },
    price: {
        type: Number,
        required: [true, 'a tour price is missing']
    },
    priceDiscount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour must have a desctipon']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'a tour must have images']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        // for hiding the data
        select: false
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// creating a model for our DB
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour