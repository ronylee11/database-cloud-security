const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("express-async-handler")

const { body, matchedData, param } = require("express-validator")
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

const checkUserDetails = [
    param("customerID").isInt().notEmpty(),
    asyncHandler(async(req, res) => {
        checkValidatorResults(req, res)
        const { customerID } = req.params;
        
        if (parseInt(customerID) !== req.user.id) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "You can only view details of your own account")
        }
    
        const request = new sql.Request();
        request.input("CustomerID", sql.Int, customerID);
    
        const result = await request.execute("usp_GetCustomerInfoById");
    
        if (result.recordset.length === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
        }
    
        res.status(StatusCodes.OK).json(result.recordset[0]);
    }

    )
]

const getTransactionHistory = [
    param("customerID").isInt().notEmpty(),
    asyncHandler(async(req, res) => {
        checkValidatorResults(req, res)
        const { customerID } = req.params;
        
        if (parseInt(customerID) !== req.user.id) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "You can only view details of your own account")
        }

        const request = new sql.Request()
        request.input("CustomerID", sql.Int, customerID)
        const result = await request.execute("Transactions.GetHistoryByID")

        if (result.recordset.length === 0) {
            res.status(StatusCodes.NOT_FOUND);
        }

        res.status(StatusCodes.OK).json(result.recordset);
    })
]

module.exports = {
    checkUserDetails,
    createUser,
    getTransactionHistory
}