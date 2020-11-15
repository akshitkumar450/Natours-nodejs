const express = require('express')

const router = express.Router({ mergeParams: true })  // enabling mergeParams->true will help in accesing the req.params value from other routers.
//  bcz routers have only access to req.params of there routers only.
// we have use mergeParams here bcz we want to have access of tourId from tourroutes router


const { getAllReviews, createNewReview, deleteReview, updateReview, setTourUserIds, getReview } = require('./../controllers/reviewControllers')
const { protect, restrictTo } = require('./../controllers/authControllers')

router.use(protect)

router.get('/', getAllReviews)
router.post('/', restrictTo('user'), setTourUserIds, createNewReview)



router.delete('/:id', restrictTo('admin', 'user'), deleteReview)
router.patch('/:id', restrictTo('admin', 'user'), updateReview)
router.get('/:id', getReview)


module.exports = router