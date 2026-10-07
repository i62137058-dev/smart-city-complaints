const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((err) => {
    if (err) {
        console.log("Database connection error:", err);
        return;
    }

    console.log("MySQL database connected successfully!");
});

module.exports = db;