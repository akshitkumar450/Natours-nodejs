const mongoose = require('mongoose')



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


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review