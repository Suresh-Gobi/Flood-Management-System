

/**
 * User Routes
 * 
 * This module defines the routes for user-related operations in the Flood Management System.
 * It includes routes for user authentication, user management, and role-based access control.
 * 
 * @module Routes/user.route
 * @requires express
 * @requires ../Controllers/user.controller
 * @requires ../Utils/auth
 * @requires ../Utils/roleauth
 */

/**
 * POST /signup
 * Route for user registration.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * POST /signin
 * Route for user login.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * POST /reqotp
 * Route to request a password reset OTP.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * POST /reset-password
 * Route to reset the user's password using OTP.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * PUT /user/update
 * Route to update user details.
 * Requires authentication.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * GET /user/get
 * Route to get the details of the authenticated user.
 * Requires authentication.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * GET /user/getall
 * Route to get all users.
 * Requires authentication and admin role.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * PUT /user/update-role
 * Route to update the role of a user.
 * Requires authentication and admin role.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/**
 * DELETE /user/admin/:userId
 * Route to delete a user by admin.
 * Requires authentication and admin role.
 * @function
 * @memberof module:Routes/user.route
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const express = require("express");
const userController = require("../Controllers/user.controller");
const authMiddleware = require("../Utils/auth");
const authorize = require("../Utils/roleauth");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/reqotp", userController.sendPasswordResetOTP);

router.post("/reset-password", userController.resetPassword);

router.put("/user/update", authMiddleware, userController.updateUserDetails);

router.get("/user/get", authMiddleware, userController.getUserDetails);

router.get("/user/getall",authMiddleware, authorize(["admin"]), userController.getAllUsers);

router.put("/user/update-role", authMiddleware,  authorize(["admin"]), userController.updateUserRole);

router.delete("/user/admin/:userId",authMiddleware,  authorize(["admin"]), userController.deleteUser);


module.exports = router;
