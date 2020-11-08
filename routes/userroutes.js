const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup } = require('./../controllers/authControllers')

router.post('/signup', signup)

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createNewUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
