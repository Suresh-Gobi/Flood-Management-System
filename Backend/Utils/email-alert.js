/**
 * Sends a verification email with an alert code to the specified email address.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} alert - The alert code to be included in the email.
 *
 * @example
 * sendVerificationEmail('example@example.com', '12345');
 *
 * This function uses the Nodemailer library to send an email with the provided
 * alert code. The email includes both plain text and HTML content.
 *
 * Note: Ensure that the SMTP_USER and SMTP_PASS environment variables are set
 * for authentication, or the default values will be used.
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

const sendVerificationEmail = (email, alert) => {
    const mailOptions = {
        from: "htnpraveen@gmail.com",
        to: email,
        subject: "ALerts",
        text: `Your alert code is: ${alert}`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                <p style="color: #007BFF; font-size: 24px; font-weight: bold;">${alert}</p>
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
