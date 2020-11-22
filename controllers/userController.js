const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const ApiError = require('./../utils/apiErrors');
const { use } = require('../routes/userroutes');
const factory = require('./handlerFactory')
const multer = require('multer')
const sharp = require('sharp')

// if we dont want to use image processing then we can use it else not

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb is a call back fn  in which first parameter is error and second parameter is a path to destination
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//      // file is same as  req.file    
//     const ext = file.mimetype.split('/')[1]
//     // cb is a call back fn  in which first parameter is error and second parameter is a name of file to be made
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

//  with this image will stored in our memory as a buffer
// bcz doing image processing we dont want to store image in our file system
// with this method req.file.filename will not be set
const multerStorage = multer.memoryStorage()

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

//  while doing image processing we need to store the image in memory as a buffer
// 
const resizePhoto = async (req, res, next) => {
  // if there is not image to be uploaded
  if (!req.file) return next()
  // req.file.buffer it will read the image from the memory which was stored as a buffer
  //  we want to store the only square images
  // req.file.filename is not defined bcz we have stored the image as a buffer .
  //  we can use filename here bcz req.file.filename is not defined here and it has been used in further middleware in updateMe middleware so we have to define it before running that middleware
  // we have prefilled the filename property on req.file
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)
  next()
}


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
  uploadUserPhoto,
  resizePhoto
};
