const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("express-async-handler")

const createUser = asyncHandler(async(req, res) => {
    const { username, password } = req.body

    await sql.query(`insert INTO Users VALUES 
        ('${username}', 
        '${password}', 
        HASHBYTES('SHA2_256', CONVERT(NVARCHAR(32),'${password}'))
        )
    `)

    res.sendStatus(StatusCodes.CREATED)

})

const checkUserDetails = async(req, res) => {

    res.json(req.user)
}

module.exports = {
    checkUserDetails,
    createUser
}