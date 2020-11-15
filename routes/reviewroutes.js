const express = require('express')

const router = express.Router({ mergeParams: true })  // enabling mergeParams->true will help in accesing the req.params value from other routers.
//  bcz routers have only access to req.params of there routers only.
// we have use mergeParams here bcz we want to have access of tourId from tourroutes router


const { getAllReviews, createNewReview, deleteReview, updateReview, setTourUserIds } = require('./../controllers/reviewControllers')
const { protect, restrictTo } = require('./../controllers/authControllers')


router.get('/', getAllReviews)
router.post('/', protect, restrictTo('user'), setTourUserIds, createNewReview)
router.delete('/:id', deleteReview)
router.patch('/:id', updateReview)


module.exports = router