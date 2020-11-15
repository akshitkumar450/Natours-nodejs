const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const ApiError = require('./../utils/apiErrors');
const { use } = require('../routes/userroutes');
const factory = require('./handlerFactory')



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

// filtering out unwanted fields from req.body that we dont want to update
const filterObj = (obj, ...allowedFields) => {
  //  allowedFields will be array  
  //  allowedField =['name','email']
  const newObj = {}
  //  Object.keys(obj) will return an array of object keys
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]
    }
  })
  return newObj
}

// upadating the  currently authenticated user his-self data
//  only update name and email
const updateMe = catchAsyncError(async (req, res, next) => {

  // 1) create a error if user tries to  POST  password data for update

  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError('this route is not for password updates.please use /updatePassword'), 400)
  }

  //  we can't use save method here bcz we will only update name and email ,but password field is required  which will cause an error
  //  so findByIdandupdate method will work here so that validaotors should not create problem

  // 2) filetered out unwanted fields names that are not allowed to be  updated
  const filtertedBody = filterObj(req.body, 'name', 'email')

  // 3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filtertedBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  })
})

const deleteMe = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null
  })
})

const getUserById = factory.getOne(User)
// const getUserById = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'this method is not done yet',
//   });
// };

const createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this method is not done yet.please usee signup',
  });
};

//  do not update password with this
const updateUser = factory.updateOne(User)
const deleteUser = factory.deleteOne(User)

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe
};
