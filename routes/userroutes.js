const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup, login, forgotPass, resetPass } = require('./../controllers/authControllers')

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgetPass', forgotPass)
router.patch('/resetPass/:token', resetPass)

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createNewUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
