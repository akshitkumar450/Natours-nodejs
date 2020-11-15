const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
dotenv.config({ path: './config.env' })
const Tour = require('../../models/tourModel')
const User = require('../../models/userModel')
const Review = require('../../models/reviewModel')


//**MONGOOSE */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connection success');
})

//read json file
// const tours = JSON.parse(fs.readFileSync(__dirname + '/tours-simple.json', 'utf-8'))

// used for data modeling 
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'))

// ************while imporing user  file just comment the password hashing fn  bcz in our json file we have stored the password after encryption only***

//insert all data to DB from json file
async function importData() {
    try {
        await Tour.create(tours)
        await User.create(users, { validateBeforeSave: false }) // done this bcz when creating a user we need to be logged in so validateBefore will skip all vlaidators
        await Review.create(reviews)
        console.log('data successfully loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit()
}

//delete all data from DB
async function deleteData() {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('data successfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} if (process.argv[2] === '--delete') {
    deleteData()
}

console.log(process.argv);