const passport = require("passport")
const userService = require("../services/users")
const userRouter = require("express").Router()

userRouter
    .get("/profile", passport.authenticate("jwt", {session: false}), userService.checkUserDetails)
    .post("/", userService.createUser)

module.exports = userRouter