const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("express-async-handler")

const { body, matchedData } = require("express-validator")
const { checkValidatorResults } = require("../utils/validators")

const loginUser = [
    body("email").isEmail().escape(),
    body("password").notEmpty().escape().isString(),
    asyncHandler(async(req, res) => {
        checkValidatorResults(req, res)
        const { email, password } = matchedData(req)
        console.log(
            {
                "email": email,
                "password": password
            }
        )

        let user = null
        const request = new sql.Request()

        user = await (await request.query(`
                EXEC Application.AccountLogin @Email = '${email}', @Password = '${password}';
            `)
        ).recordset[0]
        if (!user) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Incorrect email or password",
            )
        }

        const token = jwt.sign(
            {id: user.AccountID},
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        )

        // TODO: set as auth bearer header
        res.json({
            token,
        })
    })
]

module.exports = {
    loginUser,
}