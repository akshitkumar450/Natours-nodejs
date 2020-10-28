const express = require('express')
const router = express.Router()
const { getAllTour, getTourById, createNewTour, deleteTour,checkId } = require('../controllers/tourController')

// param method for error hadndling
//we are checking the valid id before hitting the request
router.param('id',checkId)

router.get('/', getAllTour)
router.get('/:id', getTourById)
router.post('/', createNewTour)
router.delete('/:id', deleteTour)

module.exports = router