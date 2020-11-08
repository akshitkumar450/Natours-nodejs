const User = require('./../models/userModel')
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken')
const ApiError = require('./../utils/apiErrors')


function signToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

// signin the new user to generate the token
const signup = catchAsyncError(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    })
})

// for login user
const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
        return next(new ApiError('please provide email and password'), 401)
    }
    // 2) check if user exist and password is correct
    // here we should use the email which is already signup and present in DB with the password used to signup
    // . select is used bcz we have excluded password in our model and + is used to include password 
    const user = await User.findOne({ email: email }).select('+password')
    // console.log(user);

    // correctPassword is a instance method which is avalible on all the document of user
    // if user does not exist then next line will not run
    // const correct=await user.correctPassword(password, user.password)  -> is not correct bcz if the user if not present then this will not run

    // 3) if everything is ok ,,send the token to client
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new ApiError('incorrect email or password'), 401)
    }
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token: token
    })
})


module.exports = {
    signup,
    login
}