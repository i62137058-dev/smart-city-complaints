const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,

    idleTimeout: 60000
});

db.query("SELECT 1", (err) => {
    if (err) {
        console.log("Database connection error:", err);
    } else {
        console.log("MySQL database connected successfully!");
    }
});

module.exports = db;