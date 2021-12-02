const pool = require('../config/database');


module.exports.createAddress = (country, state, street, postal_code, callback) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                try {
                    connection.query(`INSERT INTO addresses ( country, state, street, postal_code) VALUES (?, ?, ?, ?) `,
                        [country, state, street, postal_code], (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows.insertId);
                            }
                            connection.release();
                        });
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
} //End of createAddress

module.exports.getAddressId = (user_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT address_id FROM users WHERE user_id = ?`, [user_id],(err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0].address_id);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getAddressId

module.exports.getAddressIdCompany = (company_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT address_id FROM companies WHERE company_id = ?`, [company_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0].address_id);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getAddressIdCompany

module.exports.updateAddress = (country, state, street, postal_code, address_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE addresses SET country = ?, state = ?, street = ?, postal_code = ? WHERE address_id = ?`, [country, state, street, postal_code, address_id], (err, rows) => {
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

} //End of updateAddress