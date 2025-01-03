const { StatusCodes, ReasonPhrases } = require("http-status-codes")
const { ApiError } = require("./ApiError")
const jwt = require("jsonwebtoken")

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token missing");
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // Attach user info to the request object
        console.log("User decoded from token:", user);
        next();
    } catch (error) {
        console.error("Token verification error:", error.name, error.message); // Log error details
        throw new ApiError(StatusCodes.FORBIDDEN, `Invalid or expired token: ${error.message}`);
    }
};

module.exports = {
    unknownEndpoint,
    validateRole,
    authenticateToken
}