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

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'forest hiker',
  });
};
