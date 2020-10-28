const express = require('express')
const router = express.Router()
const { getAllTour, getTourById, createNewTour, deleteTour,checkId } = require('../controllers/tourController')

router.param('id',checkId)

router.get('/', getAllTour)
router.get('/:id', getTourById)
router.post('/', createNewTour)
router.delete('/:id', deleteTour)

module.exports = router