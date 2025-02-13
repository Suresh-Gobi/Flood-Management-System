const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");

require("dotenv").config(); // Load .env variables

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // Find user and attach to request
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};
