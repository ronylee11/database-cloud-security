const initService = require("../services/init")
const initRouter = require("express").Router()
initRouter
    .post("/create", initService.createTables)
    .post("/insert", initService.seedDatabase)

module.exports = initRouter