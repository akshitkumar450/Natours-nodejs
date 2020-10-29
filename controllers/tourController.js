const Tour = require('../models/tourModel')

const getAllTour = async (req, res) => {
    try {
        const tours = await Tour.find()
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
            message: "ERROR 💥,INVALID DATA SENT"
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

const deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
        data: null,
    });
};

module.exports = {
    getAllTour,
    getTourById,
    deleteTour,
    createNewTour,
    updateTour
}