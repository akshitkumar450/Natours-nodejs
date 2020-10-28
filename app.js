const express = require("express");
const app = express();
const morgan = require('morgan')

const tourRouter = require('./routes/toursRoutes')
const userRouter = require('./routes/userRoutes')

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
