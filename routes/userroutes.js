const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createNewUser, updateUser, deleteUser, updateMe, deleteMe, getMe } =
  require('../controllers/userController');

const { signup, login, forgotPass, resetPass, updatePassword, protect, restrictTo } = require('./../controllers/authControllers')

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgetPass', forgotPass)
router.patch('/resetPass/:token', resetPass)

//  ********* protect all routes after this middleware
// router.use(protect)
// we can define protect middleware at the starting from where we need to use protect middleware or we can put protect middleware in all the routes

router.patch('/updatePass', protect, updatePassword)
router.patch('/updateMe', protect, updateMe)
router.delete('/deleteMe', protect, deleteMe)

//  we want all these to be used by whom...who is logged in and only to admins
router.get('/', protect, restrictTo('admin'), getAllUsers);
router.get('/:id', protect, restrictTo('admin'), getUserById);
router.post('/', protect, restrictTo('admin'), createNewUser);
router.patch('/:id', protect, restrictTo('admin'), updateUser);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

router.get('/me', protect, getMe, getUserById), restrictTo('admin'),

  module.exports = router;
