const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit')
const ApiErrors = require('./utils/apiErrors');
const globalErrorHandler = require('./controllers/errorControllers');
// used to log the request in terminal
const morgan = require('morgan');

const tourRouter = require('./routes/toursroutes');
const userRouter = require('./routes/userroutes');

//morgan is used to log the request in our terminal
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

// Rate-limiter MiDDLEWARE
const Limiter = rateLimit({
  // 100 requests from same IP  in 1 hour if exceed then error will come
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP ,please try again later'
})

app.use('/api', Limiter)

app.use(express.json());
app.use('/', express.static(__dirname + '/public'));

//** ROUTERS */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling the routes which are not declared by adding the middleware
// if are able to run below code that means the req res cycle is not completes

app.all('*', (req, res, next) => {
  next(new ApiErrors(`can't access the ${req.originalUrl} `, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
