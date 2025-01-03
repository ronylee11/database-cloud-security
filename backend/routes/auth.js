const authRouter = require("express").Router()
const authService = require("../services/auth")
const { authenticateToken} = require("../utils/middleware");

authRouter
    .post("/login", authService.loginUser)
    .get("/dashboard-data", authenticateToken, async (req, res) => {
        // Fetch and return data for the dashboard
        res.json({ message: "Secure Dashboard Data" });
    });

module.exports = authRouter