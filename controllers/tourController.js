const fs = require('fs')

//tours is an array of all tours available
const tours = JSON.parse(
    fs.readFileSync(__dirname + "/../dev-data/data/tours-simple.json", "utf-8")
);

const getAllTour = (req, res) => {
    res.status(200).json({
        //JSend method
        status: "success",
        result: tours.length,
        data: {
            tours: tours,
        },
    });
};

const getTourById = (req, res) => {
    const id = req.params.id * 1; // to convert a string to num
    const tour = tours.find((el) => el.id === id);
    //to handle the error if the user has enter the id greater than tours array
    // if(id>tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id",
        });
    }
    res.status(200).json({
        //JSend method
        status: "success",
        data: {
            tour: tour,
        },
    });
};

const createNewTour = (req, res) => {
    console.log(req.body);
    // to make id for new tour
    const newid = tours[tours.length - 1].id + 1;
    // create new tour
    // object.assign  make a new object by joining two existing object
    const newTour = Object.assign({ id: newid }, req.body);
    // console.log(newTour);
    tours.push(newTour);
    fs.writeFile(
        __dirname + "/dev-data/data/tours-simple.json",
        JSON.stringify(tours),
        (err) => {
            if (err) return console.log("ERROR 💥");
            res.status(201).json({
                status: "success",
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id",
        });
    }
    res.status(204).json({
        //JSend method
        status: "success",
        data: null,
    });
};

module.exports={
    getAllTour,
    getTourById,
    deleteTour,
    createNewTour
}