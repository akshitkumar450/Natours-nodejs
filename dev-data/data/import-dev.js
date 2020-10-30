const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
dotenv.config({ path: './config.env' })
const Tour = require('../../models/tourModel')


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
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours-simple.json', 'utf-8'))

async function importData() {
    try {
        await Tour.create(tours)
        console.log('data successfully loaded');
        process.exit()
    } catch (err) {
        console.log(err);
    }
}
//delete all data from DB

async function deleteData() {
    try {
        await Tour.deleteMany()
        console.log('data successfully deleted');
    } catch (err) {
        console.log(err);
    }
}
if (process.argv[2] === '--import') {
    importData()
} if (process.argv[2] === '--delete') {
    deleteData()
}

console.log(process.argv);