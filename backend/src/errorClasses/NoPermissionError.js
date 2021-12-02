const BaseError = require('./BaseError');

class ForbiddenError extends BaseError {
    constructor(message, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message, ...params);

        this._name = "ForbiddenError";
        this._statusCode = 403;
    }
}

module.exports = ForbiddenError;