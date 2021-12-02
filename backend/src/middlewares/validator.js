const validator = require("validator");

module.exports.customNameValidator = (input) => {
    input = validator.blacklist(input, [
        '|', '`', '~', '?', '<', '>', '!', '@', '#', '$',
        '%', '^', '&', '*', '(', ')', '_', '+', '=', '/',
        '\\', '"', '.', ':', ';', ',', '[', ']', '{', '}'
    ]);
    return input;
}

module.exports.validateName = (input) => {
    if (!validator.isAlpha(input)) {
        input = this.customNameValidator(input);
        console.log("Not alphabetic");
        input = validator.trim(input);
        input = validator.escape(input);
    }
    return input;
}

module.exports.validateEmail = (input) => {
    input = validator.normalizeEmail(input);
    if (!validator.isEmail(input)) {
        console.log("Not an email");
        input = validator.trim(input);
        input = validator.escape(input);
    }
    return input;
}

module.exports.validateEmail = (input) => {
    input = validator.normalizeEmail(input);
    if (!validator.isEmail(input)) {
        console.log("Not an email");
        input = validator.trim(input);
        input = validator.escape(input);
    }
    return input;
}

module.exports.validateEmail = (input) => {
    input = validator.normalizeEmail(input);
    if (!validator.isEmail(input)) {
        console.log("Not an email");
        input = validator.trim(input);
        input = validator.escape(input);
    }
    return input;
}

module.exports.validateEmail = (input) => {
    input = validator.normalizeEmail(input);
    if (!validator.isEmail(input)) {
        console.log("Not an email");
        input = validator.trim(input);
        input = validator.escape(input);
    }
    return input;
}
