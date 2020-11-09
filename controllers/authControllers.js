const { promisify } = require('util')
const User = require('./../models/userModel')
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken')
const ApiError = require('./../utils/apiErrors')
const sendEmail = require('./../utils/email')


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
        role: req.body.role
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

    const user = await User.findOne({ email: email }).select('+password') // password -> hashed password from DB
    // console.log(user); 

    // correctPassword is a instance method which is avalible on all the document of user
    // if user does not exist then next line will not run
    // const correct=await user.correctPassword(password, user.password)  -> is not correct bcz if the user if not present then this will not run

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new ApiError('incorrect email or password'), 401)
    }
    // 3) if everything is ok ,,send the token to client
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token: token
    })
})

const protect = catchAsyncError(async (req, res, next) => {

    // 1) get the token and check if it exist

    // token is send using http header with request (req.headers)

    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ApiError('you are not logged in.please login to get access'), 401)
    }

    // 2) verification the token

    // decoded is the user which has the token and added in DB
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decoded);
    // 3) if user still exists
    // to check this one we first need t delete the user from DB and afte that check 
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new ApiError('the user belongs to token does not exist'), 401)
    }

    // 4)  check if the user changed the password after token was issued 

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new ApiError('recently password was changed.please login again'), 401)
    }

    // grant access to PROTECTED ROUTE
    req.user = freshUser
    next()

})

// roles will be an array of given arguments
// we have created a fn like this bcz we have to pass argumnets in fn and middleware can't accept any agruments. so we have wrapped the middleware in a function accepting the arguments
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin','lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new ApiError('you do not have access to peform this action'), 403)
        }
        next()
    }
}

const forgotPass = catchAsyncError(async (req, res, next) => {
    // 1) get user based on posted email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError('the user with the email is not found'), 404)
    }
    // 2)generate the random reset token

    const resetToken = user.createPasswordResetToken()
    // weh have save bcz ,, we only have modified the passwordResetTOken and passwordResetExpires but not save in DB
    await user.save({ validateBeforeSave: false }) // this will neglect the required fields  and validators on DB 
    // 3) send to to user's email
    // we have send the link for reseting the password to user's email(mailtrap)
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPass/${resetToken}`

    const message = `forgot your password ? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n if you didn't forget your password ,please ignore this email `

    try {
        await sendEmail({
            email: user.email,
            subject: 'your password reset token (Valid for 10 min)',
            message: message
        })
        res.status(200).json({
            status: "success",
            message: 'token send to email'
        })
    }
    catch (err) {
        user.PasswordResetToken = undefined
        user.PasswordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ApiError('there was an error sending the email. try again later!'), 500)
    }


})



const resetPass = (req, res, next) => { }

module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPass,
    resetPass,

}