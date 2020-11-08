const User = require('./../models/userModel')
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken')


const signup = catchAsyncError(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    })

    // creating jwt token for user to signup
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    })
})

module.exports = {
    signup
}