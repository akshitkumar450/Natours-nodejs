const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// prefilling some properties of req.query
const aliasTopTous = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,duration,price'
    next()
}


const getAllTour = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().limitFields().pagenation().sort()
        const tours = await features.query
        res.status(200).json({
            status: "success",
            result: tours.length,
            data: {
                tours: tours,
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: "fail",
            message: 'could not find tours'
        });
    }
};

const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({ _id: req.params.id })
        res.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: 'id is not valid'
        });
    }

};

const createNewTour = async (req, res) => {
    try {
        // const newTour=new Tour({})
        // newTour.save()
        //use above 2 line to store a new data or just use create method shown below
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};

const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data: {
                tour: updatedTour
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: "error",
            message: 'updating failed'
        });
    }

}

const deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success",
            data: null
        });
    }
    catch (err) {
        res.status(404).json({
            status: "fail",
            message: 'could not found the tour to be deleted'
        });
    }

};

const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                // match through it 
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                // 1 for ascending
                $sort: { avgPrice: 1 }
            }
            // {
            //   $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
const getMonthlyPlan = async (req, res) => {
    try {
      const year = req.params.year * 1; // 2021
  
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numTourStarts: -1 }
        },
        {
          $limit: 12
        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  }; 

module.exports = {
    getAllTour,
    getTourById,
    deleteTour,
    createNewTour,
    updateTour,
    aliasTopTous,
    getTourStats,
    getMonthlyPlan
}