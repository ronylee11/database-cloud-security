const logger = require("debug")("musicbook:error")
const { StatusCodes, getReasonPhrase } = require("http-status-codes")
const { ApiError } = require("./ApiError")

const errorConverter = (err, req, res, next) => {
    let error = err
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode
            ? StatusCodes.BAD_REQUEST
            : StatusCodes.INTERNAL_SERVER_ERROR
        const message = error.message || `${getReasonPhrase(statusCode)}`
        error = new ApiError(statusCode, message, false, err.stack)
    }
    next(error)
}


const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err
    res.locals["errorMessage"] = err.message

    const response = {
        code: statusCode,
        message,
        stack: err.stack,
    }
    logger(message)

    res.status(statusCode).send(response)
}


module.exports = {
    errorConverter,
    errorHandler,
}