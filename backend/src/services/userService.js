const config = require('../config/config');
const { emit } = require('../config/database');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");

//Simple getuser
module.exports.getUserSimple = (user_id) => {

    return new Promise((resolve, reject) => {
        console.log("second call");
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                console.log("COnnection success")
                connection.query(`SELECT * FROM users WHERE user_id = ?;`, [user_id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of simple getuser

module.exports.checkUser = (user_id, company_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM users WHERE company_id = ? AND user_id = ?;`, [company_id, user_id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of checkUser


module.exports.getRights = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`select 
                MAX(r.swot_rights) as swot_rights,
                MAX(r.ror_rights) as ror_rights,
                MAX(r.ip_rights) as ip_rights,
                MAX(r.qms_rights) as qms_rights,
                MAX(r.policy_rights) as policy_rights,
                MAX(r.raa_rights) as raa_rights,
                MAX(r.oap_rights) as oap_rights,
                MAX(r.scope_rights) as scope_rights,
                MAX(r.nr_rights) as nr_rights,
                MAX(r.td_rights) as td_rights 
                from users u, roles r, user_roles ur
                where u.user_id = ur. user_id and r.role_id = ur.role_id and u.user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
}

module.exports.getHandlerList = (company_id, clause) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT DISTINCT
                concat(u.first_name, ' ', u.last_name) AS name, 
                u.user_id
                FROM users u, roles r, user_roles ur
                WHERE u.user_id = ur.user_id AND r.role_id = ur.role_id AND u.company_id = ? AND r.${clause} >= 2`, [company_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
}

/*
module.exports.getUsersStats = (callback) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ');
                reject(err);
            } else {
                try {
                    connection.query(`SELECT
                                    COUNT(IF(user_status = 0,1,null)) as terminatedCount,
                                    COUNT(IF(user_status = 1,1,null)) as activeCount,
                                    COUNT(*) as totalCount
                                    FROM users ;`, (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        });
    });
} //End of getUsersStats
*/

module.exports.checkExistingEmailInUser = (email) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM users WHERE email = ?;`, [email], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(results)
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of checkExistingEmailInUser

module.exports.checkExistingEmailInInviteList = (email) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM invite_list where email = ?;`, [email], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(results)
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of checkExistingEmailInInviteList

module.exports.sendSuperAdminInvite = (email, company_id, invite_key) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO invite_list ( email, priv_id, company_id , invite_key ) VALUES (?, 2, ?, ?) `,
                    [email, company_id, invite_key], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of sendSuperAdminInvite

module.exports.sendUserInvite = (email, company_id, invite_key) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO invite_list ( email, priv_id, company_id , invite_key ) VALUES (?, 4, ?, ?)  `,
                    [email, company_id, invite_key], (err, rows) => {
                        if (err) {
                            console.log(err)
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of sendUserInvite

module.exports.getUserInviteList = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM invite_list WHERE company_id = ?`, [company_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
}

module.exports.getSuperAdminInviteList = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM invite_list WHERE priv_id = 2`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
}

module.exports.checkInviteListByEmail = (email, key) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM invite_list WHERE email = ? AND invite_key = ?`, [email, key], (err, results) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of checkInviteListByEmail

module.exports.deleteInvite = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`DELETE FROM invite_list WHERE email = ?`, [email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of deleteInvite


module.exports.updateKey = (email, key) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE invite_list SET invite_key = ? WHERE email = ?`, [key, email], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
}

module.exports.createSuperAdmin = (company_id, address_id, first_name, last_name, contact_number, email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO users ( company_id, user_status, address_id, first_name, last_name, priv_id, contact_number, email ) VALUES (?,1,?,?,?,2,?,?) `,
                    [company_id, address_id, first_name, last_name, contact_number, email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows.insertId);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of createSuperAdmin

module.exports.createUser = (company_id, address_id, first_name, last_name, contact_number, email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO users ( company_id, user_status, address_id, first_name, last_name, priv_id, contact_number, email ) VALUES (?,1,?,?,?,4,?,?) `,
                    [company_id, address_id, first_name, last_name, contact_number, email], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows.insertId);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of createUser

module.exports.insertAccountDetails = (user_id, password, stripe_customer_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO accounts ( user_id, password, stripe_customer_id, acc_status, gu_id ) VALUES (?,?,?,'active',UUID()) `,
                    [user_id, password, stripe_customer_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of insertUserPassword

module.exports.updateUserPassword = (user_id, password) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                console.log(`user_id: ${user_id}`);
                console.log(`Password: ${password}`);
                connection.query(`UPDATE accounts SET password = ? WHERE user_id = ?`,
                    [password, user_id], (err, rows) => {
                        if (err) {
                            console.log(err)
                            reject(err);
                        } else {
                            console.log(`Result: ${rows}`)
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation

} //End of updateUserPassword

module.exports.getUserPassword = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM accounts WHERE user_id = ?;`, [user_id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getUserPassword


module.exports.getOneUserData = (userid) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT u.user_id, u.first_name, u.last_name, u.email, u.priv_id, a.password, u.contact_number, ad.country, 
                ad.state, ad.street, ad.postal_code, a.stripe_customer_id, a.acc_id
                FROM accounts a, users u, addresses ad
                WHERE u.user_id = a.user_id AND ad.address_id = u.address_id AND u.user_id = ?`, [userid], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of getOneUserData

module.exports.updateUser = (userid, first_name, last_name, email, contact, priv_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE users SET first_name = ?, last_name = ?, email = ?, contact_number = ?, priv_id = ? WHERE user_id = ?`, [first_name, last_name, email, contact, priv_id, userid], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateUser


module.exports.getAllUserData = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT a.gu_id, u.user_id, concat(u.first_name, ' ', u.last_name) AS name, u.email, u.contact_number, u.user_status, u.reason
                FROM users u, accounts a
                WHERE u.company_id = ? AND u.user_id = a.user_id`, [company_id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of getAllUserData


module.exports.updateUserStatus = (user_id, status, reason, callback) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ');
                reject(err);
            } else {
                try {
                    connection.query(`UPDATE users SET user_status = ?, reason = ? WHERE user_id = ?`, [status, reason, user_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        });
    });
} //End of updateUserStatus



// ANYTHING UNDER HERE IS NOTBEING USED RIGHT NOW

/*
module.exports.updateUsersOnRoleAndStatus = async (users) => {
    const connection = await mysql.connection();
    let index = 0;
    try {
        await connection.query("START TRANSACTION");
        for (index = 0; index < users.length; index++) {

            var d = new Date();
            var year = d.getFullYear()
            var month = d.getMonth() + 1
            var date = d.getDate()
            var hours = d.getHours()
            var minute = d.getMinutes()
            var second = d.getSeconds()
            var currentTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
            let userData = [users[index].roleId, users[index].status, users[index].id];
            await connection.query(`UPDATE user SET role_id=? , status=?, status_last_changed='${currentTime}' WHERE user_id=?`, userData);
        }// End of for 
        await connection.query("COMMIT");
    } catch (err) {
        await connection.query('ROLLBACK');
        console.log('ROLLBACK at saving user(s) role and status changes', err);
        throw err;
    } finally {
        await connection.release();
    }// End of try..catch..finally block


} // End of updateUsersOnRoleAndStatus


module.exports.getAllUserDataForAdmin = () => {
    //getAllUserDataForAdmin name is used so that any developer can recognize that
    //this method (function) is not supposed to be called by any other programming c
    //which supports non-admin user REST API requests.
    //Objective: To retrieve all user records (both user,admin fole)
    console.log('userService\'s getAllUserDataForAdmin method is called.');

    let userDataQuery = `SELECT user_id id, first_name firstName, last_name lastName, email, user.role_id roleId, user.status, user.created_at,
    user.status_last_changed
    FROM user INNER JOIN role ON user.role_id = role.role_id ;`;


    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {

                connection.query(userDataQuery, [], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getAllUserDataForAdmin


module.exports.getOneUserDataByEmail = function (email) {
    console.log('getOneUserData method is called.');
    console.log('Prepare query to fetch one user record');
    userDataQuery = `SELECT *
        FROM user WHERE email='${email}'`;

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(userDataQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getOneUserData
module.exports.getArchivedPasswords = function (email) {
    console.log('getArchivedPasswords method is called.');
    console.log('Prepare query to fetch one user record');
    userDataQuery = `SELECT *
        FROM archive_password WHERE email='${email}'`;

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(userDataQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getOneUserData

module.exports.uploadArchived = (email, archived_pass, time, callback) => {
    console.log('archived');
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                let query = `INSERT INTO archive_password ( email, archived_pass, archived_at ) 
                    VALUES (?,?,'${time}') `;

                connection.query(query, [email, archived_pass], (err, rows) => {
                    if (err) {
                        console.log('Error on query on creating record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                        console.log(rows)
                    }

                    connection.release();

                });
            }
        });
    }); //End of new Promise object creation

}



module.exports.deleteVeriCode = (email) => {
    console.log('The proposalService - deleteFileData method is called.');
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                let query = `DELETE FROM password WHERE email ='${email}';`;
                connection.query(query, [email], (err, rows) => {
                    if (err) {
                        console.log('Error on query on deleting record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of deleteFileData

*/