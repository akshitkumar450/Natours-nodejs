const mongoose = require('mongoose')
const dotenv = require('dotenv')
// to reading the env file
//config should be efore app 
dotenv.config({ path: './config.env' })
// console.log(process.env);
const app = require('./app')

//**MONGOOSE */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// it returns a promise
// to make a connection with our database
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => {
    console.log('db connection success');
})

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log("server started");
});


