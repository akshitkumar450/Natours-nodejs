const Tour = require('../models/tourModel');
const ApiErrors = require('../utils/apiErrors');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory')

const multer = require('multer')
const sharp = require('sharp')

// prefilling some properties of req.query
const aliasTopTous = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,price';
  next();
};

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  //  to check that only images are allowed to get uploaded
  // mimetype always starts with image if any image is going to upload
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new ApiError('not an image,please upload only images', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

//  it is used when we have mix of number images to be uploaded
//  and when we have multiple fields name
const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

const resizeTourImages = catchAsyncError(async (req, res, next) => {
  //  if we are having multiple images then req.files are present
  // console.log(req.files);
  //  req.files will be object containing array for different fields name
  //  if no images to be uploaded
  if (!req.files.imageCover || !req.files.images) return next()

  // 1) process cover image
  const imageCoverFileName = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCoverFileName}`)
  //  to read the processed image by updateTour fn
  //  we have put it on req.body bcz while updating updateTour fn updates the data which is present in req.body
  req.body.imageCover = imageCoverFileName

  // 2) process images in an array

  req.body.images = []
  //  we have not handled async await correctly bcz we are using it in a callback fn whick will not prevent it for calling next without waiting for result
  // so we have to use map method which will return a array of promises and on which we can use promise .all
  await Promise.all(req.files.images.map(async (file, idx) => {
    const filename = `tour-${req.params.id}-${Date.now()}-${idx + 1}.jpeg`
    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${filename}`)

    req.body.images.push(filename)
  }))

  next()
})
//  when we have multiple images with same field name
// upload.array('images',5)


// const getAllTour = catchAsyncError(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .limitFields()
//     .pagenation()
//     .sort();
//   const tours = await features.query;
//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });

const getAllTour = factory.getAll(Tour)

// const getTourById = catchAsyncError(async (req, res, next) => {
//   // populate method will include the guide fields in tour but only in O/P not in DB
//   // const tour = await Tour.findById(req.params.id).populate({
//   //   path: 'guides',                   // included fields
//   //   select: '-__v -passwordChangedAt'  // excluded fields
//   // })

//   //  we have put the above code in query middleware bcz it will run for all find queries

//   const tour = await (await Tour.findById(req.params.id)).populate('reviews')

//   // const tour = await Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new ApiErrors('no tour find at ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });


const getTourById = factory.getOne(Tour, { path: 'reviews' })

// const createNewTour = catchAsyncError(async (req, res, next) => {
//   // const newTour=new Tour({})
//   // newTour.save()
//   //use above 2 line to store a new data or just use create method shown below
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

const createNewTour = factory.createOne(Tour)

// const updateTour = catchAsyncError(async (req, res, next) => {
//   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updatedTour) {
//     return next(new ApiErrors('no tour find at ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: updatedTour,
//     },
//   });
// });

const updateTour = factory.updateOne(Tour)

// const deleteTour = catchAsyncError(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new ApiErrors('no tour find at ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
// });

const deleteTour = factory.deleteOne(Tour)


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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
const getToursWithin = catchAsyncError(async (req, res, next) => {
  const { distance, unit, latlng } = req.params
  const [lat, lng] = latlng.split(',') // by descturing

  const radius /*(radians )*/ = unit === 'mi' ? distance / 3963.2 /*(radius of earth in miles)*/ : distance / 6378.1  /*(radius of earth in km)*/

  if (!lat || !lng) {
    return next(new ApiErrors('please provide latitide and longitude in format ', 400))
  }
  // console.log(distance, unit, lat, lng);

  // ***geospatial query
  //  always first as longi and then lati
  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });

})

//  for calculating distance of all tours from starting point

const getDistances = catchAsyncError(async (req, res, next) => {
  const { unit, latlng } = req.params
  const [lat, lng] = latlng.split(',') // by descturing
  const multiplier = unit === 'mi' ? 0.000621371  /*m*/ : 0.001
  if (!lat || !lng) {
    return next(new ApiErrors('please provide latitide and longitude in format ', 400))
  }

  const distances = await Tour.aggregate([
    // only stage in geospatial 
    {
      //  automaicalyy startLocation  fields index will used in calculations
      // geoNear should be always first
      //  but in tourModel we have write a code that will always $match field is added to the pipeline().. so in order to get below code running just comment that code 
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      },
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  })
})
module.exports = {
  getAllTour,
  getTourById,
  deleteTour,
  createNewTour,
  updateTour,
  aliasTopTous,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages
};
