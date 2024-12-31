const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("express-async-handler")

const { body, matchedData } = require("express-validator")
const { checkValidatorResults } = require("../utils/validators")

const createUser = [
    body("email").isEmail().escape(),
    body("password").notEmpty().escape().isString(),
    body("name").notEmpty().escape().isString(),
    body("phoneNum").notEmpty().escape().isString(),
    body("address").notEmpty().escape().isString(),
    body("age").isNumeric().toInt(),
    body("accountType").isString(),
    asyncHandler(async(req, res) => {
        checkValidatorResults(req, res)
        const { email, password, name, phoneNum, address, age, accountType } = matchedData(req)

        const json_data = {
            email: email,
            password: password,
            name: name,
            contact: phoneNum,
            address: address,
            age: age,
            accountType: accountType
        }

        await sql.query(`
            EXEC Application.CreateAccounts
            @Email = '${email}',
            @Password = '${password}',
            @Name = '${name}',
            @Contact = '${phoneNum}',
            @Age = ${age},
            @Address = '${address}',
            @AccountType = '${accountType}'
            ;
        `)

        res.status(StatusCodes.CREATED).json({"msg": "Account created!"})
    })
]

const checkUserDetails = async(req, res) => {

    res.json(req.user)
}

module.exports = {
    checkUserDetails,
    createUser
}