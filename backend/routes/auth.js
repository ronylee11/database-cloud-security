const authRouter = require("express").Router()
const authService = require("../services/auth")

authRouter
    .post("/login", authService.loginUser)
    .get("/test", authService.test)

module.exports = authRouter