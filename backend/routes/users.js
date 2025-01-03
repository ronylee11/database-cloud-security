const passport = require("passport")
const userService = require("../services/users")
const userRouter = require("express").Router()
const { authenticateToken} = require("../utils/middleware");
userRouter
    .get("/profile/:customerID", authenticateToken, userService.checkUserDetails)
    .post("/", userService.createUser)

module.exports = userRouter