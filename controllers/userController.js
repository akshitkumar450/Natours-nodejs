const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');


const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users: users,
    },
  });
});


const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this method is not done yet',
  });
};
const createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this method is not done yet',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this method is not done yet',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this method is not done yet',
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  deleteUser,
  updateUser,
};
