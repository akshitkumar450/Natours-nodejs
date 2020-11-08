const User = require('./../models/userModel')
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken')
const ApiError = require('./../utils/apiErrors')

//  function for genreating the token

function sign(id) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
    return token
}


const signup = catchAsyncError(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    })

    // creating jwt token for user to signup
    const token = sign(newUser._id)

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    })
})

const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    // 1)  check if email and password exist
    if (!email || !password) {
        return next(new ApiError('please provide email and password', 400))
    }

    // 2)  if user exist and password is correct    
    //. select is used bcz we have excluded password in our model and + is used to include password 
    const user = await User.findOne({ email: email }).select('+password')
    // correctPassword is a instance method which is avalible on all the document of user
    // const correct=await user.correctPassword(password, user.password)  -> is not correct bcz if the user if not present then this will not run
    console.log(user);
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new ApiError('incorrect password or email'), 401)
    }

    // 3) if everything is ok ,then send token to client
    const token = sign(user.id)
    res.status(200).json({
        status: 'success',
        token: token
    })
})

module.exports = {
    signup,
    login
}