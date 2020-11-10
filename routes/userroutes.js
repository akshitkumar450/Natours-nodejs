const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  updateMe
} = require('../controllers/userController');

const { signup, login, forgotPass, resetPass, updatePassword, protect } = require('./../controllers/authControllers')

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgetPass', forgotPass)
router.patch('/resetPass/:token', resetPass)

router.patch('/updatePass', protect, updatePassword)
router.patch('/updateMe', protect, updateMe)

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createNewUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
