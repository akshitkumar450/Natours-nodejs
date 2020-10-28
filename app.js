const express = require("express");
const morgan = require('morgan')
const app = express();

const tourRouter = require('./routes/toursroutes')
const userRouter = require('./routes/userroutes')

//morgan is used to log the request in our terminal
app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//** ROUTERS */
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// app.route("/api/v1/tours")
//   .get(getAllTour)
//   .post(createNewTour);
// app.route("/api/v1/tours/:id")
//   .get(getTourById)
//   .delete(deleteTour);

module.exports = app;
