const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const ApiErrors = require('./utils/apiErrors');
const globalErrorHandler = require('./controllers/errorControllers');
// used to log the request in terminal
const morgan = require('morgan');
const hpp = require('hpp');
const path = require('path');

const tourRouter = require('./routes/toursroutes');
const userRouter = require('./routes/userroutes');
const reviewRouter = require('./routes/reviewroutes');
const viewRouter = require('./routes/viewroutes');

//morgan is used to log the request in our terminal
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

// ******PUG template*****
app.set('view engine', 'pug');
// app.set('views',__dirname+'/views')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// security HTTP Headers HELMET MIDDLWARE ,,always on top of routes
app.use(helmet());

// Rate-limiter MiDDLEWARE
const Limiter = rateLimit({
  // 100 requests from same IP  in 1 hour if exceed then error will come
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP ,please try again later',
});

app.use('/api', Limiter);

app.use(express.json({ limit: '10kb' }));
/*  {
  "email":{"$gt":""},
  "password":"newpass1234"
}*/
//  with above request we can login with the password without knowing email id ...bcz {"$gt":""} is always true

//  DATA Sanitization against NOSQL query injection
app.use(mongoSanitize()); // this will fail the above code to login

//  DATA Sanitization against XSS
app.use(xss()); // it will prevent the from html code in request and convert them in  to spl. query
// <div id='bad code'>mike </div>  ====>> ("&lt;div id='bad code'>mike &lt;/div>")

// PREVENT POLLUTION PARAMETER
// it will not allow duplicates in query string
//  ?sort=duration&sort=price will not work
//  but after using hpp ?sort=dsuration&sort=price will only sort by price
app.use(
  hpp({
    //  whitelist will allow the specific property to have duplicates in query string
    whitelist: ['duration', 'ratingsAverage', 'price', 'difficulty'],
  })
);

// app.use('/', express.static(__dirname + '/public'));

//** ROUTERS */

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// handling the routes which are not declared by adding the middleware
// if are able to run below code that means the req res cycle is not completes

app.all('*', (req, res, next) => {
  next(new ApiErrors(`can't access the ${req.originalUrl} `, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
