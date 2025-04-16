/**
 * Middleware to authenticate and authorize a user based on a JSON Web Token (JWT).
 *
 * This middleware checks for the presence of a JWT in the "Authorization" header of the request.
 * If the token is valid, it decodes the token to retrieve the user ID, fetches the user from the database,
 * and attaches the user object (excluding the password) to the `req` object for further use in the request lifecycle.
 *
 * @module Utils/auth
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.header - The headers of the HTTP request.
 * @param {string} req.header.Authorization - The "Authorization" header containing the JWT.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The callback to pass control to the next middleware.
 * @throws {Error} Responds with a 401 status code if the token is missing or invalid.
 * @throws {Error} Responds with a 404 status code if the user associated with the token is not found.
 * @returns {void}
 */
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");

require("dotenv").config();

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

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
