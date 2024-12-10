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

    // TODO: Replace query with actual SQL command 
    try {
        // dont ask
        user = await (await new sql.Request().query(`select * from users where ID=${parseInt(jwt_payload.id)}`)).recordset[0]
        // console.log(user)
    }
    catch (err) {
        console.log(err)
    }

    // If user exists, return user
    if (user) {
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