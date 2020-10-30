const Tour = require('../models/tourModel')

const getAllTour = async (req, res) => {
    try {
        // shallow copy of req.query object
        // using ... we take the copy of req.query and using {...req.query } we create a new objects
        const queryObj = { ...req.query }
        //**excluding spl fieldsa name from our query */
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => {
            delete queryObj[el]
        })
        //** ADVANCED FILTERING */
        // for eg- if we want to search rating gte=5
        // {difficulty:'easy',rating:{$gte:5}}

        // we write query for searching gte,gt,lte,lt 
        //  /api/v1/tours?duration[lte]=5&difficulty=easy

        // we have converted our req.query in such a way that it turns to be mongoose query
        // convert [gte],[gt],[lte],[lt] from req.query to $gte,$ge,$lte,$lt
        
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
            return `$${match}`
        })

        // console.log(JSON.parse(queryStr));

        //**FOR QUERYING */
        const query = Tour.find(JSON.parse(queryStr))
        const tours = await query

        //** FOR QUERYING  */
        // another way 
        // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

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

module.exports = {
    getAllTour,
    getTourById,
    deleteTour,
    createNewTour,
    updateTour
}