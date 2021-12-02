const Errors = require('./Errors');


function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    // log out the error
    console.log(err);    
    // custom errors
    if (err instanceof Errors.BaseError) {
        return res.status(err.errorCode).send(err.json);
    }

    // default error not covered under custom errors
    // create a custom error from our error library
    const internalServerError = new Errors.InternalServerError();
    res.status(internalServerError.errorCode).send(internalServerError.json);
}

module.exports = errorHandler;