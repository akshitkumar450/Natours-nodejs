const Tour = require('../models/tourModel')

const getAllTour = (req, res) => {
    res.status(200).json({
        //JSend method
        // status: "success",
        // result: tours.length,
        // data: {
        //     tours: tours,
        // },
    });
};

const getTourById = (req, res) => {
    const id = req.params.id * 1; // to convert a string to num
    // const tour = tours.find((el) => el.id === id);
    // //to handle the error if the user has enter the id greater than tours array

    // res.status(200).json({
    //     //JSend method
    //     status: "success",
    //     data: {
    //         tour: tour,
    //     },
    // });
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

const deleteTour = (req, res) => {
    res.status(204).json({
        //JSend method
        status: "success",
        data: null,
    });
};

module.exports = {
    getAllTour,
    getTourById,
    deleteTour,
    createNewTour,
}