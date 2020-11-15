const catchAsyncError = require('./../utils/catchAsyncError')
const ApiErrors = require('./../utils/apiErrors');
const APIFeatures = require('./../utils/apiFeatures')



//  this function will handle all the delete operations for all the different models(Model===>tours,users,reviews)
exports.deleteOne = (Model) => catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new ApiErrors('no document find at ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: null,
    });
})

//  this function will handle all the update operations for all the different models(Model===>tours,users,reviews)
exports.updateOne = (Model) => catchAsyncError(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedDoc) {
        return next(new ApiErrors('no tour find at ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedDoc,
        },
    });
})

//  this function will handle all the creating operations for all the different models(Model===>tours,users,reviews)
exports.createOne = (Model) => catchAsyncError(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: newDoc,
        },
    });
})

//  popOptions is used for populating the tour
exports.getOne = (Model, popOptions) => catchAsyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    // const doc = await Model.findById(req.params.id).populate('reviews')
    if (!doc) {
        return next(new ApiErrors('no document find at ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
})

exports.getAll = (Model) => catchAsyncError(async (req, res, next) => {

    //  used in getAllReview fn
    // *** To allow for nested GET reviews on tour (A SMALL HACK)
    let filterObj = {}
    if (req.params.tourId) filterObj = { tour: req.params.tourId }

    //  these api featues will also work on getAllReview  and getAllUsers
    //  basically it will work on all the fn where it has been used

    const features = new APIFeatures(Model.find(filterObj), req.query)
        .filter()
        .limitFields()
        .pagenation()
        .sort();
    // const docs = await features.query.explain();  // to get statstics of tours  // for indexing
    const docs = await features.query;
    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: {
            data: docs,
        },
    });
})

