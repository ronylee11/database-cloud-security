const { StatusCodes, ReasonPhrases } = require("http-status-codes")
const { ApiError } = require("./ApiError")

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" })
}

const validateRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next()
        } else {
            throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
        }
    }
}

module.exports = {
    unknownEndpoint,
    validateRole,
}