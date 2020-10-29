// defining a schema for our tours
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour name is missing'],
        unique: true
    },
    price: {
        type: Number,
        // it is validator 
        required: [true, 'a tour price is missing']
    },
    rating: {
        type: Number,
        default: 4.5
    }
})

// creating a model for our DB
const Tour = mongoose.model('Tour', tourSchema)

module.exports=Tour