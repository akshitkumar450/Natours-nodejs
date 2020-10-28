const express = require('express')
const router = express.Router()
const { getAllTour, getTourById, createNewTour, deleteTour } = require('../controllers/tourController')


router.get('/', getAllTour)
router.get('/:id', getTourById)
router.post('/', createNewTour)
router.delete('/:id', deleteTour)

module.exports = router