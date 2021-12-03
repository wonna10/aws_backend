const config = require('../config/config');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//UUID To UserID
module.exports.convertUserId = (user_uuid) => {
    console.log(`converting in process... \n${user_uuid}`);
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT users.user_id FROM users WHERE user_uuid = ?;`,
                    [user_uuid], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (rows.length == 1) {
                                resolve(rows)
                            } else {

                                reject(err)
                            }
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
}

// Start of sendResetPasswordEmail
module.exports.sendResetPasswordEmail = (email) => {
    return new Promise((resolve, reject) => {
        console.log("sendResetPasswordEmail is running");

        const linkExpiryInSeconds = 180;
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log("Database Connection Error", err);
                    return reject(err);
                } else {
                    connection.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, rows) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            if (rows.length === 0) {
                                reject(`No user exists with that email`);
                            } else {
                                // email exists and we can attempt to send them a random 6 digit code/ link to reset password
                                const user_uuid = rows[0].user_uuid;
                                const userID = rows[0].user_id;
                                const JWTPayload = {
                                    "user_uuid": user_uuid,
                                    "email": email,
                                }

                                // 3 minute validity token
                                const oneTimeToken = jwt.sign(JWTPayload, config.JWTKey, { expiresIn: linkExpiryInSeconds })
                                console.log("Token ", bcrypt.hashSync(oneTimeToken));
                                connection.query(`UPDATE accounts SET hashedPasswordResetJWTToken = ? WHERE user_id = ?`, [bcrypt.hashSync(oneTimeToken), userID], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else {
                                        const mailTransport = nodemailer.createTransport({
                                            host: "smtp.mailtrap.io",
                                            port: 2525,
                                            auth: {                                                
                                                user: config.mailTrapUserName,
                                                pass: config.mailTrapPasswod,
                                            }
                                        });

                                        mailTransport.sendMail({
                                            from: '"eISO-System-noreply" <no-reply@eISOSystem.org>', // sender address
                                            to: email, // list of receivers
                                            subject: "Reset Password", // Subject line
                                            // html body
                                            html: `
                                            <style>
                                            p {
                                                word-wrap: break-word
                                            }
                                            </style>
        
                                            <p>If you did not request a password reset, ignore this message and contact your system administrator reset.</p>
                                            <p>You can reset your password at this <a href="http://3.210.248.149:3000/resetPasswordV2/token=${oneTimeToken}">link</a></p>
                                            <p>Alternatively, use this token to reset your password:</p>
                                            <p>${oneTimeToken}</p>
                                            <p>This link will expire in ${(linkExpiryInSeconds / 60).toFixed(0)} minutes</p>
                                            `,
                                        });
                                        console.log(`Successfully sent`)
                                        resolve();
                                    }
                                });

                            }
                        }
                    });
                }
                connection.release();
            }); // end of getConnection
        } catch (error) {
            console.log("error sending email");
            reject(error);
        }
    }); // end of promise
}
// End of sendResetPasswordEmail

// Start of resetPassword
module.exports.resetPassword = (passwordResetJWTToken, newPassword) => {
    return new Promise(async (resolve, reject) => {
        console.log("resetPassword is running");
        try {
            const {user_uuid, email} = jwt.verify(passwordResetJWTToken, config.JWTKey);
            console.log("useruuid" + passwordResetJWTToken)
            const user_info = await this.convertUserId(user_uuid);
            const user_id = user_info[0].user_id;
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log("Database Connection Error", err);
                    return reject(err);
                } else {
                    // first check that the link hasn't been used before
                    connection.query(`SELECT hashedPasswordResetJWTToken FROM accounts WHERE user_id = ?`, [user_id], (err, rows) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            // will be null if the user has ever used it
                            const hashedPasswordResetJWTToken = rows[0].hashedPasswordResetJWTToken;
                            if (!hashedPasswordResetJWTToken) {
                                console.log("Reset Password link has been used before");
                                return reject("Reset Password link has been used before");
                            } else {
                                // change the password and also invalidate the jwt token that was used to change the password
                                const hashedPassword = bcrypt.hashSync(newPassword);
                                connection.query(`UPDATE accounts SET password = ?, hashedPasswordResetJWTToken = null, date_modified = CURRENT_TIMESTAMP() WHERE user_id = ?`, [hashedPassword, user_id], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        }
                    });
                }
                connection.release();
            }); // end of getConnection
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.log("JWT Token Expired");
                reject("Password Reset Link Expired");
            } else {
                console.log(error);
                reject("Incorrect Credentials Provided");
            }

        }
    }); // end of promise
}

module.exports.authenticateUser = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                console.log("connection success")
                connection.query(`SELECT u.user_id, u.user_uuid, a.acc_id, u.first_name, u.last_name, u.company_id, p.priv_name, 
                u.priv_id, u.email, a.password, a.login_attempts, u.user_status, c.status, a.acc_status
                FROM accounts a, users u, privileges p, companies c
                WHERE u.user_id = a.user_id AND p.priv_id = u.priv_id AND u.company_id = c.company_id AND u.email = ?`,
                    [email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (rows.length == 1) {
                                resolve(rows)
                            } else {

                                reject(err)
                            }
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
}



module.exports.authenticateAdmin = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT a.acc_id, u.user_id, u.user_uuid, u.first_name, u.last_name, u.company_id, p.priv_name, 
                u.priv_id, u.email, a.password, a.login_attempts, u.user_status, a.acc_status
                FROM accounts a, users u, privileges p
                WHERE u.user_id = a.user_id AND p.priv_id = u.priv_id AND u.priv_id = 1 AND u.email = ?`,
                    [email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (rows.length == 1) {
                                resolve(rows)

                            } else {
                                reject(err)
                            }
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
}

module.exports.getUserIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT user_id FROM users WHERE email = ?`,
                    [email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (rows.length == 1) {
                                console.log(rows[0].user_id)
                                resolve(rows[0].user_id)

                            } else {
                                reject(err)
                            }
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
}



module.exports.incrementNumber = (number_of_login, email) => {
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE accounts a, users u SET a.login_attempts = ? WHERE u.email = ?`, [number_of_login, email], (err, rows) => {
                    if (err) {
                        console.log('Error on query on creating record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

}

module.exports.resetNumber = (email) => {
    console.log('incremented');
    const resetMyNumber = 0
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE accounts a, users u SET a.login_attempts = ? WHERE u.email = ?`, [resetMyNumber, email], (err, rows) => {
                    if (err) {
                        console.log('Error on query on creating record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

}

module.exports.resendCode = (veri_code, expireDate, email) => {
    console.log(veri_code, expireDate, email);
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE password SET veri_code = ?, expireDate = ? WHERE email = ? `, [veri_code, expireDate, email], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); // End of new Promise object creation


}

