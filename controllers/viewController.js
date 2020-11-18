const Tour = require('./../models/tourModel');
const catchasyn = require('./../utils/catchAsyncError');

exports.getOverView = catchasyn(async (req, res) => {
  // 1  get tour data from Db
  const tours = await Tour.find();
  // 2 build template
  // 3 render that template using tour data from 1

  res.status(200).render('overview', {
    title: 'all tours',
    // tours is an array of all tours
    tours: tours,
  });
});

exports.getTour = catchasyn(async (req, res) => {
  // 1) get the data ,for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'rating review user',
  });
  // 2) build the template
  // 3) redner the template data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour: tour,
  });
});
