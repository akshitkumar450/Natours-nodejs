const dotenv = require('dotenv')
const mongoose = require('mongoose')
// to reading the env file
//config should be efore app 
dotenv.config({ path: './config.env' })
// console.log(process.env);
const app = require('./app')

//**MONGOOSE */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// it returns a promise
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => {
    console.log('db connection success');
})

// defining a schema for our tours
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour name is missing'],
        unique: true
    },
    price: {
        type: Number,
        // it is validator 
        required: [true, 'a tour price is missing']
    },
    rating: {
        type: Number,
        default: 4.5
    }
})

// creating a model for our DB
const Tour = mongoose.model('Tour', tourSchema)

// creating a new tour
const testtour = new Tour({
    name: 'camper park',
    price: 697,
  
})

// saving new tour in DB
// it returns a promise
testtour.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log('ERROR💥',err);
})

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log("server started");
});


