const errorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
const errorProd = (err, res) => {
    if (err.isOperationError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.log('error 💥');
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        })
    }

}



function globalErrorHandler(err, req, res, next) {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'developement') {
        errorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        errorProd(err, res)
    }
}

module.exports = globalErrorHandler