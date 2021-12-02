const BaseError = require('./BaseError');

class AuthenticationError extends BaseError {
    constructor(message, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message, ...params);

        this._name = "AuthenticationError";
        this._statusCode = 401;
    }
}

module.exports = AuthenticationError;