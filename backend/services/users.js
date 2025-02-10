const jwt = require("jsonwebtoken")
const pool = require("../db")
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

        const [accountResult] = await pool.execute(
            `INSERT INTO Account (Balance, Email, Password, AccountType) VALUES (0.00, '${email}', SHA2('${password}', 256), '${accountType}');`,
        );
        console.log(accountResult)
        const accountID = accountResult.insertId;

        // insert accountID into person table alongside other info
        await pool.execute(
            'INSERT INTO Person (Name, Address, AccountID, Contact, Age) VALUES (?, ?, ?, ?, ?);',
            [name, address, accountID, phoneNum, age]
        );


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
    
        const result = await pool.execute(`SELECT * FROM Person WHERE CustomerID = ${parseInt(customerID)};`);
        console.log(result[0].length)
        
        if (result[0].length === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
        }
    
        res.status(StatusCodes.OK).json(result[0]);
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

        // my apolocheese to anyone who has to see this
        const result = await pool.execute(`
            SELECT 
                pSender.Name AS SenderName,
                pReceiver.Name AS ReceiverName,
                t.TransactionAmount,
                th.TransactionDate
            FROM 
                Transfers t
            JOIN 
                TransactionHistory th ON t.TransferID = th.TransferID
            JOIN 
                Account senderAccount ON t.SenderAccountID = senderAccount.AccountID
            JOIN 
                Person pSender ON senderAccount.AccountID = pSender.AccountID
            JOIN 
                Account receiverAccount ON t.ReceiverAccountID = receiverAccount.AccountID
            JOIN 
                Person pReceiver ON receiverAccount.AccountID = pReceiver.AccountID
            WHERE 
                t.SenderAccountID = ${parseInt(customerID)} OR t.ReceiverAccountID = ${parseInt(customerID)};
        `);
        if (result[0].length === 0) {
            res.status(StatusCodes.NOT_FOUND);
        }

        res.status(StatusCodes.OK).json(result[0]);
    })
]

module.exports = {
    checkUserDetails,
    createUser,
    getTransactionHistory
}