const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");


var randomize = require('randomatic');
const nodemailer = require('nodemailer');
var moment = require('moment');
var dayjs = require('dayjs');
const { NONAME } = require('dns');

// import error modules
// const Errors = require('../errorClasses/Errors');
const { AuthenticationError, InternalServerError, BadRequestError } = require('../errorClasses/Errors');
// Start of sendResetPasswordEmail
module.exports.sendResetPasswordEmail = async (req, res, next) => {
    console.log("sendResetPasswordEmail method is called.")
    const { email } = req.body;
    try {
        
        if (!email) return res.status(400).send({ "message": "No email provided in body" });
        await auth.sendResetPasswordEmail(email);

        res.status(200).end();
    } catch (error) {
        return res.status(500).send({
            "message" : error,
        })   ;
    }
} // End of sendResetPasswordEmail

// Start of resetPassword
module.exports.resetPassword = async (req, res, next) => {
    const { password: newPassword } = req.body;

    const bearerToken = req.headers.authorization;
    
    if (!bearerToken) return res.status(403).send({ "message": "No credentials provided"});

    const jwtToken = bearerToken.match(/Bearer ([A-Za-z0-9\-\._~\+\/]+)/)[1];

    if (!jwtToken) return res.status(403).send({ "message": "Token is malformed"});

    try {
        if (!jwtToken || !newPassword) return res.status(400).send({ "message": "Malformed input"});
        await auth.resetPassword(jwtToken, newPassword);

        res.status(200).end();
    } catch (error) {
        return res.status(error.match(/incorrect|password/i) ? 401 : 500).send({
            message: error
        });
    }
} // End of resetPassword

//  /api/u/users/signin
exports.processUserLogin = async (req, res, next) => {
    console.log("processUserLogin is running.")
    const email = req.body.email;
    const password = req.body.password;
    try {
        let users = await auth.authenticateUser(email);
        if (users.length == 1) {
            if (users[0].user_status == 0 || users[0].status == 0) {
                // return res.status(400)
                //     .send({ error: true, code: 400, description: 'Account or Company has been terminated', content: [] })
                throw (new BadRequestError("Account or Company has been terminated."));
            }
            if ((password == null) || (users[0].password == null)) {
                // return res.status(401).send({
                //     code: 401,
                //     error: true,
                //     description: 'Credentials are not valid.',
                //     content: []

                // });

                throw (new AuthenticationError("Credentials are not valid"));
            }
            if (bcrypt.compareSync(password, users[0].password) == true) {
                console.log(`userID ${users[0].user_id} UUID ${users[0].user_uuid}`)
                const responseBody = {
                    displayName: users[0].first_name + ' ' + users[0].last_name,
                    token: jwt.sign({
                        accId: users[0].acc_id,
                        userUUID: users[0].user_uuid,
                        name: users[0].first_name + ' ' + users[0].last_name,
                        companyId: users[0].company_id,
                        email: users[0].email,
                        privilege: users[0].priv_name,
                        privId: users[0].priv_id,
                    },
                        config.JWTKey, {
                        expiresIn: 15 //Expires in 24 hrs
                    }),
                }; //End of data variable setup
                let refreshToken = jwt.sign({
                    accId: users[0].acc_id,
                    userUUID: users[0].user_uuid,
                    name: users[0].first_name + ' ' + users[0].last_name,
                    companyId: users[0].company_id,
                    email: users[0].email,
                    privilege: users[0].priv_name,
                    privId: users[0].priv_id,
                },
                    config.JWTKey, {
                    expiresIn: 3600 //Expires in 24 hrs
                })
                res.cookie("refreshToken", refreshToken, {
                    secure: true,
                    httpOnly: true,
                    signed: true,
                    sameSite: 'none',
                    expires: dayjs().add(1, "days").toDate(),
                });
                res.status(200).send(responseBody);

            } else {
                // return res.status(401).send({ error: true, code: 401, description: 'Login fail.', content: [] });
                throw (new AuthenticationError("Login Failed"));

            }
        }

    } catch (error) {
        // console.log(error)
        // const message = 'Internal technical error.';
        // return res.status(500).send({
        //     code: 500,
        //     error: true,
        //     description: message,
        //     content: []
        // });

        next(error);
    }
};


exports.processAdminLogin = async (req, res, next) => {
    console.log("processAdminLogin is running.")
    let email = req.body.email;
    let password = req.body.password;
    try {
        let results = await auth.authenticateAdmin(email)
        if (results.length == 1) {
            if ((password == null) || (results[0] == null)) {
                // return res.status(401).send({
                //     code: 401,
                //     error: true,
                //     description: 'Login failed.',
                //     content: []
                // });

                throw (new AuthenticationError("Login Failed"));
            }
            if (bcrypt.compareSync(password, results[0].password) == true) {

                let data = {
                    displayName: results[0].first_name + ' ' + results[0].last_name,
                    email: results[0].email,
                    token: jwt.sign({
                        userUUID: results[0].user_uuid,
                        email: results[0].email,
                        privilege: results[0].priv_name,
                    },
                        config.JWTKey, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                }; //End of data variable setup

                return res.status(200).send(data);
            } else {
                // return res.status(401).send({
                //     code: 401,
                //     error: true,
                //     description: 'Login failed.',
                //     content: []
                // });
                throw (new AuthenticationError("Login Failed"));

            }

        }
    } catch (error) {
        // return res.status(401).send({
        //     code: 401,
        //     error: true,
        //     description: 'Login failed.',
        //     content: []
        // });
        
        next(error);
    }
};// End of processAdminLogin

exports.processRefreshToken = async (req, res, next) => {
    let JWTToken = req.body.jwt
    // console.log(jwt)
    // console.log(req.signedCookies.refreshToken) // use this to get refreshtoken
    let decodedRefreshToken = jwt_decode(req.signedCookies.refreshToken);
    let decodedJWT = jwt_decode(JWTToken)

    // console.log(decodedJWT)
    // console.log(decodedRefreshToken)
    try {
        if (decodedRefreshToken != undefined) {
            if (moment(decodedJWT.exp * 1000).format() < moment().format()) {
                let newToken = jwt.sign({
                    accId: decodedRefreshToken.accId,
                    userId: decodedRefreshToken.userId,
                    userUUID: decodedRefreshToken.userUUID,
                    name: decodedRefreshToken.name,
                    companyId: decodedRefreshToken.companyId,
                    email: decodedRefreshToken.email,
                    privilege: decodedRefreshToken.privilege,
                    privId: decodedRefreshToken.privId,
                },
                    config.JWTKey, {
                    expiresIn: 15 //Expires in 24 hrs
                })
                return res.status(200).send(newToken);
            }
        }
        else {
            return res.status(401).json({ message: 'Session has expired' });
        }
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }
}; //End of processRefreshToken



exports.processClearCookies = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken')
        return res.end()
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }
}; //End of processClearCookies



exports.processDeleteRefreshToken = async (req, res, next) => {
    let user_id = req.params.userId
    try {
        let results = await auth.deleteRefreshToken(user_id)
        return res.status(200).send(results);
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }
}; //End of processDeleteRefreshToken

exports.processcodeCheck = (req, res, next) => {
    const veri_code = req.body.data;
    console.log(veri_code);
    try {
        auth.codeCheck(veri_code, function (error, results) {
            if (error) {
                // const message = 'Internal technical error.';
                // return res.status(500).send({
                //     code: 500,
                //     error: true,
                //     description: message,
                //     content: []
                // });
                throw (new InternalServerError());
            } else {
                if (results.length == 1) {
                    var databaseDate = results[0].expireDate
                    databaseDate = moment(databaseDate).format('YYYY-MM-DD HH:mm:ss');
                    var expireDate = moment().subtract(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                    console.log(databaseDate)
                    console.log(expireDate)
                    if (expireDate < databaseDate) {
                        console.log('Code has not expired')
                    }
                    else {
                        // const message = 'Internal technical error.';
                        // return res.status(500).send({
                        //     code: 500,
                        //     error: true,
                        //     description: message,
                        //     content: []
                        // });

                        throw (new InternalServerError());
                    }
                    return res.status(200).send('');
                }
                else {

                    // return res.status(401).send({ error: true, code: 401, description: 'Code fail.', content: [] });
                    throw (new AuthenticationError("Code fail."));
                } //End of password comparison with the retrieved decoded password.
            } //End of checking if there are returned SQL results

        })

    } catch (error) {
        // return res.status(500).send({
        //     code: 500,
        //     error: true,
        //     description: 'Internal error',
        //     content: []
        // });
        next(error);
    } //end of try
};

exports.processResendCode = async (req, res, next) => {
    console.log('processResendCode running');
    // Collect data from the request body 
    var veri_code = randomize('0', 6)
    console.log(veri_code);
    // Collect user id which was created inside the req by the middleware function
    const email = req.body.data
    var expireDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(expireDate)

    try {
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "7bda98d8fd2449",
                pass: "2259268e843a82"
            }
        });

        const mailOptions = {
            from: 'vindication@enron.com',
            to: `${email}`,
            subject: 'New Verification Code',
            text: `${veri_code}` + ' ' + 'is your NEW verification code. It will expire in 3 minutes.'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        results = await auth.resendCode(veri_code, expireDate, email);
        return res.status(200).json({ message: 'Team information has been changed.' });
    } catch (error) {
        // console.log('processResendCode method : catch block section code is running');
        // console.log(error, '=======================================================================');
        // return res.status(500).json({ message: 'Unable to complete update code operation' });
        next(error);
    }


}; //End of processUpdateOneTeam


exports.processUpdateLastLogin = async (req, res, next) => {
    let email = req.email
    let currentTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    console.log(email)
    console.log(currentTime)
    try {
        results = await auth.updateLastLogin(currentTime, email);
        console.log(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        // console.log('processUpdateOneUser method : catch block section code is running');
        // console.log(error, '=======================================================================');
        // return res.status(500).json({ message: 'Unable to complete update operation' });
        next(error);
    }
}

exports.processGetNotification = async (req, res, next) => {
    let email = req.email
    let currentTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');

    console.log(email)


    try {
        let results = await user.getOneUserData(email);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                'userdata': results[0],
            }

            try {

                console.log(jsonResult.userdata.last_login)
                console.log(currentTime)
                let results = await auth.getNumberofNotification(currentTime, jsonResult.userdata.last_login);

                console.log(results)
                if (results) {
                    var jsonResult = {
                        'userdata': results,
                    }
                    Notifications = jsonResult.userdata
                    return res.status(200).json(Notifications.length);
                }

            }
            catch (error) {
                // let message = 'Server is unable to process your request.';
                // return res.status(500).json({
                //     message: error
                // });
                next(error);
            }
        }
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).json({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetOneUserData