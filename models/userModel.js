const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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


userSchema.pre('save', async function (next) {
    // only work if the password in not updated
    if (!this.isModified('password')) return next()

    // encrypting or hashing the password  and it will retunr a promise 
    this.password = await bcrypt.hash(this.password, 12)

    // deleting the confirm password field
    this.confirmPassword = undefined
})

const User = mongoose.model('User', userSchema)
module.exports = User