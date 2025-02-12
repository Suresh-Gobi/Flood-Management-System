const express = require('express');
const userController = require('../Controllers/user.controller');

const router = express.Router();

// Route to get all users
router.post('/signup', userController.signup);

router.post('/signin', userController.signin);


router.post('/reqotp', userController.sendPasswordResetOTP);


router.post('/reset-password', userController.resetPassword);

module.exports = router;