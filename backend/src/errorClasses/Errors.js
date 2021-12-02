// this file is to consolidate all errors created

const BaseError = require('./BaseError')
const AuthenticationError = require('./AuthenticationError');
const ForbiddenError = require('./NoPermissionError');
const BadRequestError = require('./BadRequestError');
const InternalServerError = require('./InternalServerError');

// Exporting the errors in one object for easy importing 
module.exports = {
    BaseError,
    AuthenticationError,
    ForbiddenError,
    BadRequestError,
    InternalServerError,
}