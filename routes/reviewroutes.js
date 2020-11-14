const express = require('express')
const router = express.Router()

const { getAllReviews, createNewReview } = require('./../controllers/reviewControllers')
const { protect, restrictTo } = require('./../controllers/authControllers')


router.get('/', getAllReviews)
router.post('/', protect, restrictTo('user'), createNewReview)


module.exports = router