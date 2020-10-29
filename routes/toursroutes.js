const express = require('express')
const router = express.Router()
const { getAllTour, getTourById, createNewTour, deleteTour,checkId,checkBody } = require('../controllers/tourController')

// param middleware method for error hadndling
//we are checking the valid id before hitting the request

// router.param('id',checkId)

router.get('/', getAllTour)
router.get('/:id', getTourById)
// while creating new user check it has name  or not if not send 400 error request
//checkbody is a middleware ,which check whether a new user has a name or not
router.post('/',checkBody,createNewTour)
router.delete('/:id', deleteTour)

module.exports = router