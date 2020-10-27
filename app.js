const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const tours = JSON.parse(fs.readFileSync(__dirname + '/dev-data/data/tours-simple.json', 'utf-8'))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        //JSend method
        status: 'success',
        result: tours.length,
        data: {
            tours: tours
        }
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id=req.params.id*1 // to convert a string to num
      const tour=tours.find(el=>el.id===id)
      //to handle the error if the user has enter the id greater than tours array
      
    // if(id>tours.length) {
      if(!tour) {
      return res.status(404).json({
              status:'fail',
             message:'invalid id'
          })
      }
    res.status(200).json({
        //JSend method
        status: 'success',
        data: {
            tour:tour
        }
    })
})


app.post('/api/v1/tours', (req, res) => {
    console.log(req.body);
    const newid = tours[tours.length - 1].id + 1;
    // object.assign  make a new object by joining two existing object
    const newTour = Object.assign({ id: newid }, req.body)
    tours.push(newTour)

    fs.writeFile(__dirname + '/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        if (err) return console.log('ERROR 💥');
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})




app.listen(4000, () => {
    console.log('server started');
})