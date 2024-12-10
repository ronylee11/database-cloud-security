const jwt = require("jsonwebtoken")
const sql = require("mssql")

const checkUserDetails = async(req, res) => {
    res.send("hey man")
    // LOOK UP HOW PASSPORTJS HANDLES USER OBJECT
}

module.exports = {
    checkUserDetails
}