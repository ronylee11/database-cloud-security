const authRouter = require("express").Router()
const authService = require("../services/auth")

authRouter
    .post("/login", authService.loginUser)

module.exports = authRouter