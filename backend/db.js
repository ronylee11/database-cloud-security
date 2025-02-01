// Create a pool for mssql, need to be separate from index.js (entry point) since other files in services/ folder need it for async/await
// (also i dont want to use promises or callbacks those suck)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.AWS_MYSQL_ENDPOINT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT),
});

module.exports = pool;