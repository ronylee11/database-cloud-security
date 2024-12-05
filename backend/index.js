const express = require('express');
const cors = require('cors');
const sql = require("mssql")

require("dotenv").config()

const app = express();
const port = 3001;

const sqlConfig = {
    server: process.env.VM_SERVER_IP,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT),
    options: {
        trustServerCertificate: true
    }
}

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/abcde", async (request, response) => {
    try {
        // create new request
        const request = new sql.Request();

        const result = await request.query("select TOP 3 CardID, CardType, ExpMonth, ExpYear, CustomerID FROM dbo.CreditCards");
        response.send(result.recordset);
        console.dir(result.recordset);
    } catch (err) {
        console.error("Error executing query:", err);
        response.status(500).send("Error executing query");
    }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


sql.connect(sqlConfig, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

