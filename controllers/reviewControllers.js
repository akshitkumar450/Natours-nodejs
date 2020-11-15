const Review = require('./../models/reviewModel')
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory')




const getAllReviews = catchAsyncError(async (req, res, next) => {

    let filterObj = {}
    if (req.params.tourId) filterObj = { tour: req.params.tourId }

    const reviews = await Review.find(filterObj)
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews: reviews
        }
    })
})

const createNewReview = catchAsyncError(async (req, res, next) => {

    // allow nested routes
    //  here  tour id will come from URL and user id will come from currently logged in user 

    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id


    const newReview = await Review.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            reviews: newReview
        }
    })
})

const deleteReview = factory.deleteOne(Review)
const updateReview = factory.updateOne(Review)

module.exports = {
    getAllReviews,
    createNewReview,
    deleteReview,
    updateReview
}





