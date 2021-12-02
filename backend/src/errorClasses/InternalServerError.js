const BaseError = require('./BaseError');

class InternalServerError extends BaseError {
    // message is a optional parameter that defaults to internal server error, custom messages accepted
    constructor(message = "This server is currently unable to handle your request", ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message, ...params);

        this._name = "InternalServerError";
        this._statusCode = 500;
    }
}

module.exports = InternalServerError;