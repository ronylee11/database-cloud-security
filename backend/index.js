const express = require('express');
const cors = require('cors');
const sql = require("mssql")
const passport = require("passport")

require("dotenv").config()

const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")


const app = express();
const port = 3001;

app.use(express.json())
require("./utils/passport")
app.use(passport.initialize());

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

        const result = await request.query("select SUSER_NAME()");
        console.log(typeof(result))
        response.send(result.recordset);
        console.dir(result.recordset);
    } catch (err) {
        console.error("Error executing query:", err);
        response.status(500).send("Error executing query");
    }
});

app.get('/health', (req, res) => {
  return res.json({ status: 'UP' });
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

app.use("/auth", authRouter)
app.use("/users", userRouter)