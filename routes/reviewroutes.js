const express = require('express')
const router = express.Router()

const { getAllReviews, createNewReview } = require('./../controllers/reviewControllers')
const { protect, restrictTo } = require('./../controllers/authControllers')


router.get('/', protect, restrictTo('user'), getAllReviews)
router.post('/', createNewReview)


module.exports = router