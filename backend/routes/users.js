const passport = require("passport")
const userService = require("../services/users")
const userRouter = require("express").Router()
// passport auth doesnt work
userRouter.get("/profile", passport.authenticate("jwt", {session: false}), userService.checkUserDetails)

module.exports = userRouter