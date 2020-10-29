const dotenv = require('dotenv')
const mongoose = require('mongoose')
// to reading the env file
//config should be efore app 
dotenv.config({ path: './config.env' })
// console.log(process.env);
const app = require('./app')

//**MONGOOSE */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('db connection success');
})

// defining a schema for our tours
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'a tour name is missing'],
        unique:true
    },
    price:{
        type:Number,
        required:[true,'a tour price is missing']
    },
    rating:{
        type:Number,
        default:4.5
    }
})

// creating a model for our DB
const tour=mongoose.model('Tour',tourSchema)


const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log("server started");
});


