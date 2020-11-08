const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ' name should not be empty']
    },
    email: {
        type: String,
        required: [true, ' email should not be empty'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, ' email is not valid ']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, ' password should not be empty'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, ' confirm your password'],
        validate: {
            // this will only work on CREATING OR SAVE
            validator: function (val) {
                return val === this.password
            },
            message: 'passwords are not same'
        }
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User