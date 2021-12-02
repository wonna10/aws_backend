const BaseError = require('./BaseError');

class BadRequestError extends BaseError {
    constructor(message, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message, ...params);

        this._name = "BadRequestError";
        this._statusCode = 400;
    }
}

module.exports = BadRequestError;