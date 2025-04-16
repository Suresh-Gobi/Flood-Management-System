/**
 * Sends a verification email with an OTP code to the specified email address.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The one-time password (OTP) code to include in the email.
 *
 * @description
 * This function uses the Nodemailer library to send an email containing an OTP code
 * for email verification. The email includes both plain text and HTML content.
 * The SMTP credentials are configured using environment variables or default values.
 *
 * @example
 * const { sendVerificationEmail } = require('./email');
 * sendVerificationEmail('example@example.com', '123456');
 *
 * @throws {Error} Logs an error message if the email fails to send.
 */
const nodemailer = require("nodemailer");

const SMTP_USER = process.env.SMTP_USER || "htnpraveen@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "ttlxdshcddgbwrru";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
});

const sendVerificationEmail = (email, otp) => {
    const mailOptions = {
        from: "htnpraveen@gmail.com",
        to: email,
        subject: "Email Verification",
        text: `Your OTP code is: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Email Verification</h1>
                <p style="color: #666; font-size: 16px;">Your OTP code is:</p>
                <p style="color: #007BFF; font-size: 24px; font-weight: bold;">${otp}</p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

module.exports = { sendVerificationEmail };
