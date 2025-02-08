const indexRouter = require("express").Router()

const authRouter = require("./auth")
const usersRouter = require("./users")
const initRouter = require("./init")

indexRouter.use("/auth", authRouter)
indexRouter.use("/users", usersRouter)
indexRouter.use("/test", initRouter)

module.exports = indexRouter