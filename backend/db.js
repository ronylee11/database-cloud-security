// Create a pool for mssql, need to be separate from index.js (entry point) since other files in services/ folder need it for async/await
// (also i dont want to use promises or callbacks those suck)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.DATABASE,
    port: parseInt(process.env.RDS_PORT),
});

module.exports = pool;