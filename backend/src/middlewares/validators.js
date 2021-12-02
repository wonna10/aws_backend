const userManager = require('../services/userService');

module.exports.registrationSchema = {

    'data.password': {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    'data.contact': {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
    'data.email': {
        normalizeEmail: true,
        isEmail: true,
        custom: {
            options: value => {
                console.log("here at validators");
                console.log("value", value)
                return userManager.checkExistingEmailInUser(value).then(email => {
                    if (email.length > 0) {
                        return Promise.reject('Email address already taken')
                    }
                })
            }
        }
    }
},
//Validating for normal user login
module.exports.loginSchema = {
'email': {
    isEmail: true,
    errorMessage:('daniouudnbawd'),
    notEmpty: true,
    errorMessage:('Email field cannot be empty.'),
    normalizeEmail: true,
    trim: true,
   //create a custom to check if the email exists or not.
  
},
'password': {
    notEmpty: true,
    withMessage:('Password field cannot be empty.')
}

}
//Validating for Admin User Login
module.exports.adminloginSchema = {
    'data.email:': {
        isEmail: true,
        withMessage:('Must be an Email'),
        notEmpty: true,
        withMessage:('Email field cannot be empty.'),
        normalizeEmail: true,
        trim: true,
        //Create a custom to check if the email exists and if the email is an admin or not.
        custom: {
            options: value => {
                console.log("Validating Login");
                console.log("value", value)
                return userManager.checkExistingEmailInUser(value).then(email => {
                    //This is the same as Validating for a normal user for now, but create a backend to check whether the email is an admin user or not in the future.
                    if (email.length <= 0) {
                        return Promise.reject('Email does not exist!')
                    }
                })
            }
        }
    },
    'data.password': {
        notEmpty: true,
        withMessage:('Password field cannot be empty.')
    }
},
//Validating for Forgot Password
module.exports.forgotpasswordSchema = {
    'data.email': {
        isEmail: true,
        errorMessage:('Must be an Email'),
        notEmpty: true,
        errorMessage:('Email field cannot be empty.'),
        normalizeEmail: true,
        trim: true,
       //create a custom to check if the email exists or not.
       custom: {
        options: value => {
            console.log("Validating Forgot Password");
            console.log("value", value)
            return userManager.checkExistingEmailInUser(value).then(email => {
                //If the user does not exist, return error.
                if (email.length <= 0) {
                    return Promise.reject('Email does not exist!')
                }
            })
        }
    }
    },
}