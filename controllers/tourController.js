const Tour = require('../models/tourModel');
const ApiErrors = require('../utils/apiErrors');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');

// prefilling some properties of req.query
const aliasTopTous = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,price';
  next();
};

const getAllTour = catchAsyncError(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .pagenation()
    .sort();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

const getTourById = catchAsyncError(async (req, res, next) => {
  // populate method will include the guide fields in tour but only in O/P not in DB
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',                   // included fields
  //   select: '-__v -passwordChangedAt'  // excluded fields
  // })

  //  we have put the above code in query middleware bcz it will run for all find queries

  const tour = await (await Tour.findById(req.params.id)).populate('reviews')

  // const tour = await Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new ApiErrors('no tour find at ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

const createNewTour = catchAsyncError(async (req, res, next) => {
  // const newTour=new Tour({})
  // newTour.save()
  //use above 2 line to store a new data or just use create method shown below
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsyncError(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new ApiErrors('no tour find at ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

const deleteTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new ApiErrors('no tour find at ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = catchAsyncError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      // match through it
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // 1 for ascending
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
const getMonthlyPlan = catchAsyncError(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      // add month as same value as id
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        // 0 it will not show
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

module.exports = {
  getAllTour,
  getTourById,
  deleteTour,
  createNewTour,
  updateTour,
  aliasTopTous,
  getTourStats,
  getMonthlyPlan,
};
