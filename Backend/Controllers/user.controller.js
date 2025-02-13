const User = require('../Models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../Utils/email');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create and return JWT token
        const payload = { id: user.id };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create and return JWT token
        const payload = { id: user.id };


        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.sendPasswordResetOTP = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

        // Save OTP to database
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
        await user.save();

        // Send OTP via email
        const emailSent = await sendVerificationEmail(user.email, otp);

        if (!emailSent) {
            return res.status(500).json({ msg: "Failed to send OTP email" });
        }

        res.json({ msg: "OTP sent to email successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // Ensure OTP is valid and not expired
        if (!user.resetPasswordOTP || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        if (user.resetPasswordOTP.toString() !== otp.toString()) {
            return res.status(400).json({ msg: 'Incorrect OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP and expiration
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        // Save updated user data
        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error('Error resetting password:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        let user = await User.findById(userId).select('-password -resetPasswordOTP -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user details:", err.message);
        res.status(500).send("Server error");
    }
};

exports.updateUserDetails = async (req, res) => {
    const { first_name, last_name, phone_number, date_of_birth, address } = req.body;
    const userId = req.user.id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update user details
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone_number = phone_number || user.phone_number;
        user.date_of_birth = date_of_birth || user.date_of_birth;
        user.address = address || user.address;

        await user.save();

        res.json({ msg: "User details updated successfully", user });
    } catch (err) {
        console.error("Error updating user details:", err.message);
        res.status(500).send("Server error");
    }
};
