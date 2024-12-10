const jwt = require("jsonwebtoken")
const sql = require("mssql")

const checkUserDetails = async(req, res) => {
    res.json(req.user)
}

module.exports = {
    checkUserDetails
}