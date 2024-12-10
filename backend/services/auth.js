const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt")

const loginUser = async(req, res) => {
    let user = null
    const request = new sql.Request()

    username = req.body.username
    password = req.body.password
    // console.log(req.body)
    
    // TODO: Replace query with actual SQL command 
    // TODO: Compare hash instead of password directly
    // query parameterization be damned i wanna make this as vulnerable as possible
    try {
        user = await request.query(`select * from users where username='${req.body.username}' AND password='${req.body.password}'`)
        // dont ask
        console.log(user.recordset[0].ID)
    }
    catch (err) {
        // throw new ApiError(StatusCodes.NOT_FOUND, "Incorrect email or password")
    }
    

    // if (!user) {
    //     throw new ApiError(
    //         StatusCodes.NOT_FOUND,
    //         "Incorrect email or password"
    //     )
    // }

    const token = jwt.sign(
        {id: user.recordset[0].ID},
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    )

    // TODO: set as auth bearer header
    res.json({
        token,
    })
}

const test = async(req, res) => {
    res.send('Hello World!');
}

module.exports = {
    loginUser,
    test
}