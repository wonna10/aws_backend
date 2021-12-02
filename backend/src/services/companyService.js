const pool = require('../config/database');

module.exports.createCompany = (name, description, address_id, email, contact_number) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO companies ( name, description, address_id, email, contact_number, status) VALUES (?,?,?,?,?,1) `,
                    [name, description, address_id, email, contact_number], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows.insertId);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of createCompany

module.exports.getAllCompanies = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM companies`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });

} //End of getAllCompanies


module.exports.updateCompanyStatus = (company_id, status, reason) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE companies SET status = ?, reason = ? WHERE company_id = ?`, [status, reason, company_id],(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of updateCompanyStatus

module.exports.updateCompany = (company_id, name, description, email, contact_number) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE companies SET name = ?, description = ?, email = ?, contact_number = ? WHERE company_id = ?`, [name, description, email, contact_number, company_id], (err, rows) => {
                        if (err) {
                            p
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of updateCompanyStatus

module.exports.getCompanyData = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT c.company_id, c.trialed, c.address_id, c.name, c.description, c.email, c.contact_number, a.country, a.state, a.street, a.postal_code FROM companies c, addresses a WHERE c.address_id = a.address_id and company_id = ?;`, [company_id],(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getCompanyStats

module.exports.getCompanyStats = () => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT
            COUNT(IF(status = 0,1,null)) as terminatedCount,
            COUNT(IF(status = 1,1,null)) as activeCount,
            COUNT(*) as totalCount
            FROM companies;`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
} //End of getCompanyStats

