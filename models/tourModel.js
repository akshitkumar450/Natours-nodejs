const mongoose = require('mongoose')
const slugify = require('slugify')
// const User = require('./userModel')
// defining a schema for our tours
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'a tour name is missing'],
            unique: true,
            trim: true,
            maxlength: [40, 'name length exceed the limit'],
            minlength: [10, 'name length is not sufficeint']
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
            required: [true, 'must have a difficulty'],
            //enum is used only for strings
            enum: {
                values: ['difficult', 'easy', 'medium'],
                message: 'difficulty is either easy,medium or difficult'
            }
        },
        price: {
            type: Number,
            required: [true, 'a tour price is missing']
        },
        priceDiscount: {
            type: Number,
            // our custom validator need to retunr true or false
            validate: {
                validator: function (val) {
                    // this only works when creating a new document
                    return val < this.price
                },
                message: 'discount price ({VALUE}) is more than price' // here VALUE refers to val
            }

        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'a tour must have a desctipon']
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            // min and max are used for numbers and dates
            min: [0, 'rating must be greater than 0'],
            max: [5, 'rating must be lesser than 5']
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
        slug: String,
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // geoJSON for geospatail data
            //  embedded object
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        // to create a document and embedd them
        location: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        // for embedding
        // guides will bea array of the user id which will contain user details
        // guides: Array

        // for referncing
        guides: [
            {
                // type each of element in guides array  will be mongoDB ID
                type: mongoose.Schema.ObjectId,
                ref: 'User' // this will create relationship b/w 2 data sets
            }
        ]
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

// for referncing the User in Tour
tourSchema.pre(/^find/, function (next) {
    // this will work for all find queries
    this.populate({
        path: 'guides',                   // included fields
        select: '-__v -passwordChangedAt'  // excluded fields
    })
    next()
    //  by using this the getAll tour fn will also show the  guides data  instaed of user id
})

// for storing the id's of all users in guides fields
// embedding  for tour guides 
// only work for creating new documents
//  embedding Users in Tours
// tourSchema.pre('save', async function (next) {
//     //  guidesPromises -> this will be an  array of promises of all the user id's
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next()
// })


// tourSchema.pre('save', function (next) {
//     console.log('will save document');
//     next()
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next()
// })

// QUery middleware 

//this refers to the current query
// tourSchema.pre('find', function (next) {

//  /^find/-> means anything starting with find
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})
tourSchema.post(/^find/, function (docs, next) {
    //docs-> is all the document that get reutnred from query
    // console.log(docs);
    console.log(`query take ${Date.now() - this.start} ms`);
    next()
})

// aggregation middleware

tourSchema.pre('aggregate', function (next) {
    //  to exclude secretTour from aggregate fn ,we just need to add another method before $match
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })  // this exclude the secretTour from output
    console.log(this.pipeline()); // this is an array  
    next()
})

// creating a model for our DB
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour