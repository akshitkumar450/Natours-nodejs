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
        minlength: 8,
        select: false
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

// to store encrypted password in our database
// we have used this bcz ,, it will run before saving into the DB .. so this is the right place to encrypt the password before saving in to database
userSchema.pre('save', async function (next) {
    // only work if the password in not updated
    if (!this.isModified('password')) return next()

    // encrypting or hashing the password  and it will retunr a promise 
    this.password = await bcrypt.hash(this.password, 12)

    // deleting the confirm password field
    this.confirmPassword = undefined
})

// it is an instance method 
userSchema.methods.correctPassword = function (candidatePass, userPass) {
    return bcrypt.compare(candidatePass, userPass)
}

const User = mongoose.model('User', userSchema)
module.exports = User