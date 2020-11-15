const catchAsyncError = require('./../utils/catchAsyncError')
const ApiErrors = require('./../utils/apiErrors')


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


