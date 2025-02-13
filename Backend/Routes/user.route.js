const express = require("express");
const userController = require("../Controllers/user.controller");
const authMiddleware = require("../Utils/auth");

const router = express.Router();

// Route to get all users
router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/reqotp", userController.sendPasswordResetOTP);

router.post("/reset-password", userController.resetPassword);

router.put("/user/update", authMiddleware, userController.updateUserDetails);

router.get("/user/get", authMiddleware, userController.getUserDetails);

module.exports = router;
