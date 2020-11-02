const mongoose = require('mongoose')
const slugify = require('slugify')
// defining a schema for our tours
const tourSchema = new mongoose.Schema(
    {
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
        startDates: [Date],
        slug: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// document middle it run before .save() and .create()
tourSchema.pre('save', function (next) {
    // this is the currenlt processed document
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.pre('save', function (next) {
//     console.log('will save document');
//     next()
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next()
// })

// creating a model for our DB
const Tour = mongoose.model('Tour', tourSchema)


module.exports = Tour