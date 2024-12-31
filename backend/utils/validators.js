const { validationResult } = require("express-validator")
const { StatusCodes } = require("http-status-codes")
const { ApiError } = require("./ApiError")

const extractError = (err) => {
    const errorMessages = {}
                
    for (const i of err.array()) {
        errorMessages[i.path] = i.msg
    }

    return errorMessages
}

// eslint-disable-next-line
const checkValidatorResults = (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        // maybe create new ApiError object first then add error.name
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid validation", extractError(error))
    }
}

module.exports = {
    checkValidatorResults
}