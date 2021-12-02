class BaseError extends Error {
    // Referenced from MDN Web Docs (https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/error)
    constructor(message, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);
        
        // underscore variables to dictate that changing these variables outside of the class method is bad (good practice)
        this._name = "BaseError";
        this._message = message;
        this._statusCode = 500;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError)
        }

        // Additional Debug Information
        this._date = new Date();
    }

    // getter to return a nicely formatted json response to send through back-end
    get json() {
        return {
            "name": this._name,
            "message": this._message,
            "statusCode": this._statusCode,
            "date": this._date,
        }
    }

    // getters to get "private" properties
    get errorCode() {
        return this._statusCode;
    }

    get name() {
        return this._name;
    }

    get message() {
        return this._message;
    }

    get date() {
        return this._date;
    }
}

module.exports = BaseError;