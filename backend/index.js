const express = require('express');
const cors = require('cors');
const sql = require("mssql")
const passport = require("passport")
const { strategy } = require("./utils/passport")

require("dotenv").config()

const indexRouter = require("./routes/index.routes");
const { errorConverter, errorHandler } = require('./utils/error');

const app = express();
const port = 3001;

app.use(express.json())
app.use(passport.initialize());
passport.use(strategy)
app.use(cors());
app.use("/api", indexRouter)

app.get('/health', (req, res) => {
  return res.json({ status: 'UP' });
});

// Error handlers so that the app doesnt crash everytime an error gets thrown
app.use(errorConverter)
app.use(errorHandler)

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

sql.connect(sqlConfig, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
