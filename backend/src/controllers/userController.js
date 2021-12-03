const userManager = require('../services/userService');
const authManager = require('../services/authService');
const validators = require('../middlewares/validator');
const config = require('../config/config');
const nodemailer = require("nodemailer");
var moment = require('moment-timezone');
const auth = require('../services/authService');
const address = require('../services/addressService')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { emit } = require('../config/database');
const stripe = require('../services/stripeService')

const { AuthenticationError, ForbiddenError } = require('../errorClasses/Errors');
const { validationResult } = require('express-validator');

function generateKey() {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


function htmlButton(token) {
    return `<html>
    <head>
    <style>
          body{
            margin: 0;
            padding: 0;
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
            background:#fff;
          }
          span{
            position: relative;
            display: inline-flex;
            width: 180px;
            height: 55px;
            margin: 0 15px;
            perspective: 1000px;
          }
          a{
            font-size: 19px;
            letter-spacing: 1px;
            transform-style: preserve-3d;
            transform: translateZ(-25px);
            transition: transform .25s;
            font-family: 'Montserrat', sans-serif;
            
          }
          a:before,
          a:after{
            position: absolute;
            content: "Register Here";
            height: 55px;
            width: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 5px solid black;
            box-sizing: border-box;
            border-radius: 5px;
          }
          a:before{
            color: #fff;
            background: #000;
            transform: rotateY(0deg) translateZ(25px);
          }
          a:after{
            color: #000;
            transform: rotateX(90deg) translateZ(25px);
          }
          a:hover{
            transform: translateZ(-25px) rotateX(-90deg);
          }
    </style>
    </head>
    <body style="margin:0;padding:0;">
        <span><font size = "7"><a href = 'http://3.210.248.149:3000/register/${token}/'>Register Here</a></font>
        </span>
    </body>
    </html>`
}

//simple get
exports.processGetUserSimple = async (req, res, next) => {
    console.log("User getting");
    try {
        results = await userManager.getUserSimple(10);


        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetRights

exports.processCheckUser = async (req, res, next) => {
    let company_id = req.query.companyId
    let user_id = req.query.userId
    try {
        let results = await userManager.checkUser(user_id, company_id);

        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processCheckUser

exports.processGetRights = async (req, res, next) => {
    let user_id = req.params.userId;
    try {
        results = await userManager.getRights(user_id)


        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetRights

exports.processGetHandlerList = async (req, res, next) => {
    let company_id = req.query.companyid;
    let clause = req.query.clause
    try {
        results = await userManager.getHandlerList(company_id, clause)


        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetHandlerList

exports.processSendSuperAdminInvite = async (req, res, next) => {
    let email = req.body.email
    let company_id = req.body.company.value
    let emailarr = []
    for (var i = 0; i < email.length; i++) {
        let result1 = await userManager.checkExistingEmailInUser(email[i])
        let result2 = await userManager.checkExistingEmailInInviteList(email[i])
        if ((result1.length != 0) || (result2.length != 0)) {
            emailarr.push(email[i])
        }
    }
    if (emailarr.length == 0) {
        for (var j = 0; j < email.length; j++) {
            let key = generateKey()
            await userManager.sendSuperAdminInvite(email[j], company_id, key);
            let token = jwt.sign({
                email: email[j],
                company_id: company_id,
                priv_id: 2,
                key: key
            },
                config.JWTKey
            )
            let transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: config.mailTrapUserName,
                    pass: config.mailTrapPasswod
                }
            });
            let info = await transporter.sendMail({
                from: '"Eiso System" <foo@example.com>', // sender address
                to: email[j], // list of receivers
                subject: "Register your Super Admin account using this link.", // Subject line
                html: htmlButton(token),
            });
        }
        return res.status(200).send({ message: 'Emails sent' });
    }
    else {
        // return res.status(401).send(emailarr);
        next(new AuthenticationError("You do not have permission"))
    }

}; //End of sendSuperAdminInvite

exports.processSendUserInvite = async (req, res, next) => {
    let email = req.body.email
    let company_id = req.body.company_id
    let emailarr = []
    for (var i = 0; i < email.length; i++) {
        let result1 = await userManager.checkExistingEmailInUser(email[i])
        let result2 = await userManager.checkExistingEmailInInviteList(email[i])
        if ((result1.length != 0) || (result2.length != 0)) {
            emailarr.push(email[i])
        }
    }
    if (emailarr.length == 0) {
        for (var j = 0; j < email.length; j++) {
            let key = generateKey()
            await userManager.sendUserInvite(email[j], company_id, key);
            let token = jwt.sign({
                email: email[j],
                company_id: company_id,
                priv_id: 4,
                key: key
            },
                config.JWTKey
            )
            let transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: config.mailTrapUserName,
                    pass: config.mailTrapPasswod
                }
            });
            let info = await transporter.sendMail({
                from: '"Eiso System" <foo@example.com>', // sender address
                to: email[j], // list of receivers
                subject: "Register your User account using this link.", // Subject line
                // text: `localhost:3005/register/${token}`, // plain text body
                html: htmlButton(token),
            });
        }
        return res.status(200).send({ message: 'Emails sent' });
    }
    else {
        // return res.status(401).send(emailarr);
        next(new AuthenticationError("You do not have permission"))
    }
}; //End of sendSuperAdminInvite

exports.processGetSuperAdminInviteList = async (req, res, next) => {
    try {
        let results = await userManager.getSuperAdminInviteList()
        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetSuperAdminInviteList

exports.processGetUserInviteList = async (req, res, next) => {
    let company_id = req.params.companyId;
    try {
        let results = await userManager.getUserInviteList(company_id)
        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetUserInviteList

exports.processCheckEmailAndKey = async (req, res, next) => {
    let email = req.body.data.email
    let key = req.body.data.key
    try {
        results = await userManager.checkInviteListByEmail(email, key)
        return res.status(200).send(results);
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetInviteList

exports.processDeleteInvite = async (req, res, next) => {
    let email = req.params.email
    try {
        await userManager.deleteInvite(email)
        return res.status(200).send({ message: 'Deleted' });
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processDeleteInvite

exports.processResendInvite = async (req, res, next) => {
    let email = req.body.data.email
    let company_id = req.body.data.company_id
    let priv_id = req.body.data.priv_id
    let key = generateKey()
    try {
        await userManager.updateKey(email, key)
        let token = jwt.sign({
            email: email,
            company_id: company_id,
            priv_id: priv_id,
            key: key
        },
            config.JWTKey
        )
        let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: config.mailTrapUserName,
                pass: config.mailTrapPasswod
            }
        });
        if (priv_id == 2) {
            let info = await transporter.sendMail({
                from: '"Eiso System" <foo@example.com>', // sender address
                to: email, // list of receivers
                subject: "Register your Super Admin account using this link.", // Subject line
                //text: `localhost:3005/register/${token}`, // plain text body
                html: htmlButton(token),
            });
        }
        else {
            let info = await transporter.sendMail({
                from: '"Eiso System" <foo@example.com>', // sender address
                to: email, // list of receivers
                subject: "Register your User account using this link.", // Subject line
                // text: `localhost:3005/register/${token}`, // plain text body
                html: htmlButton(token),
            });
        }

        return res.status(200).send({ message: 'Updated' });
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processResendInvite

exports.processCreateUser = async (req, res, next) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({
            errors: errors.array()
        });
    }

    else {
        let data = req.body.data
        console.log(data);

        let email = data.email
        let key = data.key
        let priv_id = data.priv_id
        let company_id = data.company_id
        let first_name = data.firstName
        let last_name = data.lastName
        let password = data.password
        let contact_number = data.contact
        let country = data.country.label
        let state = data.state
        let street = data.street
        let postal_code = data.postalcode
        let results = await userManager.checkInviteListByEmail(email, key)
        if (results.length != 0) {
            try {
                let address_id = await address.createAddress(country, state, street, postal_code)
                if (priv_id == 2) {
                    user_id = await userManager.createSuperAdmin(company_id, address_id, first_name, last_name, contact_number, email)
                }
                else if (priv_id == 4) {
                    user_id = await userManager.createUser(company_id, address_id, first_name, last_name, contact_number, email)
                }
                let customer = await stripe.createStripeCustomer(first_name, last_name, email)
                bcrypt.hash(password, 10, async (err, hash) => {
                    await userManager.insertAccountDetails(user_id, hash, customer.id)
                })
                await userManager.deleteInvite(email)
                return res.status(200).json({ message: 'User has been created.' });
            } catch (error) {
                return res.status(500).send("Error");
            }
        }
        else {
            // return res.status(401).send("Invite Link has expired");
            next(new AuthenticationError("Invite Link has expired"));
        }

    }
    // Collect data from the request body 

}; //End of processCreateUser

exports.processResetPassword = async (req, res, next) => {
    let gu_id = req.params.guId;
    let password = req.body.data.password;
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            await userManager.updateUserPassword(gu_id, hash)
        })
        return res.status(200).json({ message: 'Password has been resetted' });

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processResetPassword

exports.processChangePassword = async (req, res, next) => {
    let user_uuid = req.params.user_uuid;
    let currentPassword = req.body.data.currentPassword;
    let newPassword = req.body.data.newPassword;
    console.log(`user_uuid ${user_uuid} \ncurrentPassword ${currentPassword} \nnewPassword ${newPassword}`);
    try {
        let rows = await authManager.convertUserId(user_uuid);
        let user_id = rows[0].user_id;
        let results = await userManager.getUserPassword(user_id);
        console.log(`results ${results}`);
        if (bcrypt.compareSync(currentPassword, results[0].password) == true) {

            bcrypt.hash(newPassword, 10, async (err, hash) => {
                console.log(`Hash Password: ${hash}`)
                await userManager.updateUserPassword(user_id, hash)
            })
            console.log(`Password successfully updated`)
            return res.status(200).json({ message: 'Password has been changed' });
        }
        else {
            // return res.status(406).json({ message: 'Wrong current password' });
            // find me now ??
            next(new AuthenticationError("Invalid Credentials entered")); // changed to be more ambigious 
            console.log(`Password missmatch`)
            return res.status(406).json({ message: 'Wrong current password' });
        }
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processChangePassword

exports.processGetOneUserData = async (req, res, next) => {
    let user_id = req.params.userId
    try {
        let results = await userManager.getOneUserData(user_id);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetOneUserData


exports.processUpdateUser = async (req, res, next) => {
    let user_id = req.params.userId
    let data = req.body.data
    let first_name = data.firstName
    let last_name = data.lastName
    let email = data.email
    let contact_number = data.contact
    let country = data.country.label
    let state = data.state
    let street = data.street
    let postal_code = data.postalcode
    let priv_id = data.privilege.value
    try {
        let address_id = await address.getAddressId(user_id);
        await userManager.updateUser(user_id, first_name, last_name, email, contact_number, priv_id);

        await address.updateAddress(country, state, street, postal_code, address_id);
        return res.status(200).send('Sucessfully updated');

    } catch (error) {
        if (error.errno == 1062) {
            // return res.status(401).send({
            //     code: 401,
            //     error: true,
            //     description: 'Email does not exist in invite list or has already been registered.',
            //     content: []
            // });
            next(new ForbiddenError("Email does not exist in invite list or has already been registered."));
        }
        else {
            // let message = 'Server is unable to process your request.';
            // return res.status(500).send({
            //     message: error
            // });
            next(error);
        }
    }

}; //End of processUpdateUser


exports.processUpdateUserStatus = async (req, res, next) => {
    let user_id = req.params.userId
    let status = req.body.data.status
    let reason = req.body.data.reason
    try {
        let results = await userManager.updateUserStatus(user_id, status, reason)
        return res.status(200).send(results);
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processUpdateUserStatus


exports.processGetUsersStats = async (req, res, next) => {
    try {
        let results = await userManager.getUsersStats()
        return res.status(200).send(results);
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processGetUsersStats



exports.processGetAllUserData = async (req, res, next) => {
    let company_id = req.params.companyId
    try {
        let results = await userManager.getAllUserData(company_id);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetOneUserData

exports.processGetAllUserDataForAdmin = async (req, res, next) => {

    try {
        let results = await userManager.getAllUserDataForAdmin();
        console.log('Inspect result variable inside controller\'s processGetUserDataForAdmin code\n', results);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }
    } catch (error) {
        //When testing this processGetUserDataForAdmin, my client side was able to 
        //see this error details because I response with {message:<error details from userService>}
        /*
        {"message":{"code":"ER_BAD_FIELD_ERROR","errno":1054,
        "sqlMessage":"Unknown column 'fullname' in 'field list'","sqlState":"42S22",
        "index":0,"sql":"SELECT user_id, fullname, email, role.role_name ,
        user.role_id, user.status  \n
        FROM user INNER JOIN role ON user.role_id = role.role_id ;"}}
        */
        /*Must change this json response data in the future to something else so 
        that client side dont get the error details*/

        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });

        next(error);

    }

}; //End of processGetAllUserDataForAdmin
exports.processGetOneUserDataByEmail = async (req, res, next) => {
    let email = req.body.email;
    let passwordFill = req.body.passwordFill;
    try {
        let results = await userManager.getOneUserDataByEmail(email);
        if (results) {
            //hashed from archive
            password = results[0].user_password
            console.log(password)
            try {
                let passResults = await userManager.getArchivedPasswords(email);
                //if archive got password
                if (passResults) {
                    var doesMatch = false
                    for (var i = 0; i < passResults.length; i++) {
                        doesMatch = await bcrypt.compare(passwordFill, passResults[i].archived_pass);
                        if (doesMatch) {
                            break
                        }
                    }

                    //now, validate the password the user filled up with the current
                    //store db
                    console.log(doesMatch)
                    if (doesMatch == false) {
                        console.log('NEVER USED BEFORE')
                        bcrypt.hash(passwordFill, 10, async (err, hash) => {
                            let timezone = "Asia/Singapore"
                            let insertTime = moment().tz(timezone).format('YYYY-MM-DD hh:mm:ss')
                            let localTime = moment()
                            console.log(moment.tz.guess())
                            userManager.uploadArchived(email, password, insertTime)
                            userManager.updatePassword(hash, email)
                            console.log("CHANGED PASSWORD")

                            userManager.deleteVeriCode(email)
                            auth.resetNumber(email)
                            //we send the email to confirm to the user that they have changed their password.
                            var transporter = nodemailer.createTransport({
                                host: "smtp.mailtrap.io",
                                port: 2525,
                                auth: {
                                    user: config.mailTrapUserName,
                                    pass: config.mailTrapPasswod
                                }
                            });

                            const mailOptions = {
                                from: 'vindication@enron.com',
                                to: `${email}`,
                                subject: 'Verification Code',
                                text: `You have successfully changed passwords. Your password was last changed at ${localTime}`
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                        })
                    }
                } else {
                    //if user never reset password before
                    // console.log('NEVER USED BEFORE')
                    // bcrypt.hash(passwordFill, 10, async (err, hash) => {
                    //     archivedPassword = hash
                    //     userManager.uploadArchived(email, hash)
                    // })
                }
            } catch (error) {
                // return res.status(500).send({
                //     code: 500,
                //     error: true,
                //     description: 'Internal error',
                //     content: []
                // });
                next(error);
            } //end of try

            return res.status(200).send('');

            return res.status(200).json(jsonResult);

        }
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).json({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetOneUserData



