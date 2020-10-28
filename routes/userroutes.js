const express = require('express')
const router = express.Router()


const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this method is not done yet'
    })
}
const getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this method is not done yet'
    })
}
const createNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this method is not done yet'
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this method is not done yet'
    })
}
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this method is not done yet'
    })
}

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createNewUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
