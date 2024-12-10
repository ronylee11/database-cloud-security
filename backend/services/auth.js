const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")
const sql = require("mssql")
const { ApiError } = require("../utils/ApiError")
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("express-async-handler")

const loginUser = asyncHandler(async(req, res) => {
    let user = null
    const request = new sql.Request()
    // select * FROM USERS WHERE ID=1

// DECLARE @HASH NVARCHAR(32);
// set @HASH = CONVERT(NVARCHAR(32),'Wick')
// select HASHBYTES('SHA2_512', CONVERT(NVARCHAR(32),'Wick')) = HASH
    
    // TODO: Replace query with actual SQL command 
    // TODO: Compare hash instead of password directly
    // query parameterization be damned i wanna make this as vulnerable as possible
    
    // double awaits because its awesome
    user = await (await request.query(`select * from users where username='${req.body.username}' AND password='${req.body.password}'`)).recordset[0]
    
    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Incorrect email or password",
        )
    }

    const token = jwt.sign(
        {id: user.ID},
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    )

    // TODO: set as auth bearer header
    res.json({
        token,
    })
})


module.exports = {
    loginUser,
}