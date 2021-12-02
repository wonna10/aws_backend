const config = require('../config/config');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");

module.exports.checkRole = (role_id, company_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM roles WHERE company_id = ? AND role_id = ?;`, [company_id, role_id],(err, results) => {
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

} //End of checkRole

module.exports.createRole = (company_id, name, description) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO roles ( company_id, name, description ) VALUES (?,?,?) `,
                [company_id, name, description], (err, rows) => {
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

} //End of createRole

module.exports.updateRole = (role_id, name, description) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE roles SET name = ?, description = ? WHERE role_id = ?`, [name, description, role_id],(err, rows) => {
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

} //End of updateRole


module.exports.updateRoleRights = (role_id, swot, ror, ip, qms, policy, raa, oap, scope, nr, td) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE roles SET swot_rights = ?, ror_rights = ?, ip_rights = ?, qms_rights = ?, policy_rights = ?, raa_rights = ?, oap_rights = ?, scope_rights = ?, nr_rights = ?, td_rights = ? WHERE role_id = ?`, [swot, ror, ip, qms, policy, raa, oap, scope, nr, td, role_id], (err, rows) => {
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

} //End of updateRole

module.exports.deleteRole = (role_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`DELETE FROM roles WHERE role_id = ?`, [role_id], (err, rows) => {
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

} //End of updateRole

module.exports.getAllRoles = (company_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM roles WHERE company_id = ? ORDER BY created_at;`, [company_id], (err, results) => {
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

} //End of getAllRoles


module.exports.getOneRole = (role_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM roles WHERE role_id = ?;`, [role_id], (err, results) => {
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

} //End of getOneRole

module.exports.getUserRole = (user_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM user_roles WHERE user_id = ?;`, [user_id], (err, results) => {
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

} //End of getUserRole

module.exports.insertUserRole = (user_id, role_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO user_roles ( user_id, role_id ) VALUES (?,?) `,
                [user_id, role_id], (err, rows) => {
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

} //End of insertUserRole

module.exports.deleteUserRoles = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`DELETE FROM user_roles WHERE user_id = ?`, [user_id], (err, rows) => {
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

} //End of updateRole