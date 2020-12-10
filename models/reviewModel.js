const mongoose = require('mongoose')
const Tour = require('./tourModel')



const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review cant be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    // review must be for any tour and must be  by any user 
    //  parent referncing


    // reviews pointing to tour
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//  for preventign duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })



//  query middleware for populating the selected fiedls in O/P
// without this middleware in getAllreviews Fn there will be only id's of tour and user
//  but after putting this query middleware selected data of user and tour will be shown
// for populating the two fields we need to populate twice
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })
    next()
})

//  static methods
//  static methods are avaliable on Model
//  in static methods this point to Model
//  we want to cal the averageRating and ratingQty when evr we create  a new  review id added or deleted
//  only when created  a new review
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    // this point to current Model
    const stats = await this.aggregate([

        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    // console.log(stats);  // stats is an array 
    //  updating the Tour document with the stats
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }


}
// to use the static method
reviewSchema.post('save', function () {
    // this point to current Review

    this.constructor.calcAverageRatings(this.tour) // this point to current Model who create the document

    // Review.calcAverageRatings(this.tour) // Review is not available here

})
//  for updating and deleting the review   we will use query middleware bcz they findByIDandupdate and delete
//  in query middleare we dont have access to current Review 
//  A SMALL TRICK

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.R = await this.findOne()
    // console.log(this.R);
})

//  tranfer this.R from pre to post 
reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne()-> will not work here ,query is already executed
    await this.R.constructor.calcAverageRatings(this.R.tour)
})





const Review = mongoose.model('Review', reviewSchema)

module.exports = Review