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

router.get("/user/getall",authMiddleware, authorize(["user"]), userController.getAllUsers);

router.put("/user/update-role", authMiddleware, userController.updateUserRole);

// router.get(
//     "/loggedusers",
//     authMiddleware,
//     authorize(["user"]),
//     userController.getLoggedUserDetails
//   );

module.exports = router;
