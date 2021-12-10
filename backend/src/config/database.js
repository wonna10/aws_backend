const mysql = require('mysql');
const config = require('./config');
//To find out more on createPool:
//https://www.npmjs.com/package/mysql#pooling-connections

const pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'petprojecthosting.c0tcz7eo9vwu.us-east-1.rds.amazonaws.com',
    user: config.databaseUserName,
    password: config.databasePassword,
    database: config.databaseName,
    multipleStatements: true
});

module.exports = pool;