const AuthenticationError = require('./AuthenticationError')

exports.testErrorHandler = async (req, res, next) => {
    try {
        // immediately test the error handling by throwing an error
        throw new AuthenticationError("New Testing Authentication aoksdjlaksd");
        // throw new Error("Test no type error");

        next();
    } catch (error) {
        next(error);
    }

}; 