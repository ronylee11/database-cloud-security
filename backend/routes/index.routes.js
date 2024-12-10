const indexRouter = require("express").Router()

const authRouter = require("./auth")
const usersRouter = require("./users")

indexRouter.use("/auth", authRouter)
indexRouter.use("/users", usersRouter)

module.exports = indexRouter