const Review = require('./../models/reviewModel')
const catchAsyncError = require('../utils/catchAsyncError');



const getAllReviews = catchAsyncError(async (req, res, next) => {
    const reviews = await Review.find()
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews: reviews
        }
    })
})

const createNewReview = catchAsyncError(async (req, res, next) => {
    const newReview = await Review.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            reviews: newReview
        }
    })
})

module.exports = {
    getAllReviews,
    createNewReview
}





