const express = require("express");
const app = express();
// used to log the request in terminal
const morgan = require('morgan')

const tourRouter = require('./routes/toursRoutes')
const userRouter = require('./routes/userRoutes')

//morgan is used to log the request in our terminal
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

app.use(express.json());
app.use('/', express.static(__dirname + '/public'))


//** ROUTERS */
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// handling the routes which are not declared by adding the middleware
// if are able to run below code that means the req res cycle is not completes

app.all('*', (req, res, next) => {
    res.status(404).send({
        status: 'fail',
        message: `can't access the ${req.originalUrl} `
    })
})

module.exports = app;
