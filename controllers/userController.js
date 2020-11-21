const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const ApiError = require('./../utils/apiErrors');
const { use } = require('../routes/userroutes');
const factory = require('./handlerFactory')
const multer = require('multer')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb is a call back fn  in which first parameter is error and second parameter is a path to destination
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    // cb is a call back fn  in which first parameter is error and second parameter is a name of file to be made
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  }
})

const multerFilter = (req, file, cb) => {
  //  to check that only images are allowed to get uploaded
  // mimetype always starts with image if any image is going to upload
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new ApiError('not an image,please upload only images', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const uploadUserPhoto = upload.single('photo')


const getAllUsers = factory.getAll(User)

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
  // console.log(req.file);
  // console.log(req.body);
  // 1) create a error if user tries to  POST  password data for update

  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError('this route is not for password updates.please use /updatePassword', 400))
  }

  //  we can't use save method here bcz we will only update name and email ,but password field is required  which will cause an error
  //  so findByIdandupdate method will work here so that validaotors should not create problem

  // 2) filetered out unwanted fields names that are not allowed to be  updated
  const filtertedBody = filterObj(req.body, 'name', 'email')
  //  just add the photo to the filterbody 
  if (req.file) filtertedBody.photo = req.file.filename

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

//  middleware for GETME
const getMe = (req, res, next) => {
  //  we will use getOne factory fn
  //  only for currently logged in user and user.id will come from logged in user 
  // and we have put  req.params.id=req.user.id bcz,, in the getOne fn it uses the req.params.id to find
  //  basically prefelling the req.params.id by user id
  req.params.id = req.user.id
  next()
}

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
  deleteMe,
  getMe,
  uploadUserPhoto
};
