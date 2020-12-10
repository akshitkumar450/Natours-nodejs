const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.json())
//tours is an array of all tours available
const tours = JSON.parse(fs.readFileSync(__dirname + '/dev-data/data/tours-simple.json', 'utf-8'))

const getAllTour = (req, res) => {
    res.status(200).json({
        //JSend method
        status: 'success',
        result: tours.length,
        data: {
            tours: tours
        }
    })
}

const getTourById = (req, res) => {
    const id = req.params.id * 1 // to convert a string to num
    const tour = tours.find(el => el.id === id)
    //to handle the error if the user has enter the id greater than tours array
    // if(id>tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        })
    }
    res.status(200).json({
        //JSend method
        status: 'success',
        data: {
            tour: tour
        }
    })
}

const createNewTour = (req, res) => {
    // console.log(req.body);
    // to make id for new tour 
    const newid = tours[tours.length - 1].id + 1;
    // create new tour
    // object.assign  make a new object by joining two existing object
    const newTour = Object.assign({ id: newid }, req.body)
    // console.log(newTour);
    tours.push(newTour)
    fs.writeFile(__dirname + '/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        // if (err) return console.log('ERROR 💥');
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        })
    }
    res.status(204).json({
        //JSend method
        status: 'success',
        data: null
    })
}

// /**get all the tours */
// app.get('/api/v1/tours', getAllTour)
// /**get tours by specific id */
// app.get('/api/v1/tours/:id', getTourById)
// /**create a new tour */
// app.post('/api/v1/tours', createNewTour)
// /**delete a tour by id */
// app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/tours').get(getAllTour).post(createNewTour)
app.route('/api/v1/tours/:id').get(getTourById).delete(deleteTour)



app.listen(3000, () => {
    // console.log('server started');
})



app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


const tourRouter = express.Router()
tourRouter.get('/', getAllTour)
tourRouter.get('/:id', getTourById)
tourRouter.post('/', createNewTour)
tourRouter.delete('/:id', deleteTour)

const userRouter = express.Router()
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/', createNewUser)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)





// ******************************************************



const getAllTour = async (req, res) => {
    try {

        // console.log(req.query);

        //**1a  FILTERING */

        // api/v1/tours?name=The Forest Hiker&price=397

        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => {
            delete queryObj[el]
        })
        //**1b ADVANCED FILTERING */

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
            return `$${match}`
        })


        //** 2 sorting */


        //**FOR QUERYING */
        let query = Tour.find(JSON.parse(queryStr))

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            //default sorting on the basis of createdAt field
            query = query.sort('-createdAt')
        }



        if (req.query.fields) {
            const field = req.query.fields.split(',').join(' ');
            query = query.select(field)
        } else {
            // excluding fields
            query = query.select('-__v')
        }


        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skipVal = (page - 1) * limit
        query = query.skip(skipVal).limit(limit)
        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (skipVal >= numTours) {
                throw new Error('this page does not exist')
            }
        }


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