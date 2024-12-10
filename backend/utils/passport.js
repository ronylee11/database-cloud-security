const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy
const sql = require("mssql")
const { ApiError } = require("./ApiError")
const { StatusCodes } = require("http-status-codes")
const passport = require("passport")
require("dotenv").config()

// JWT_SECRET: symmetric key for jwt verification
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

// Extract JWT from request header
// Runs on every authenticated route, the async() function is the verify
const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
    let user = null
    const request = new sql.Request()

    // TODO: Replace query with actual SQL command 
    try {
        user = await request.query(`select * from users where ID=${jwt_payload.ID}`)
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA")
        console.log(user.recordset[0])
    }
    catch (err) {
        console.log(err)
    }


    // If user exists, return user
    if (!user) {
        // cannot read properties of null, reading recordset
        done(null, user)
    }
    else {
        return done(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Token"), false)
    }
})

passport.use(strategy)

module.exports = {
    passport
}