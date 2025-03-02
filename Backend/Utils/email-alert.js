const nodemailer = require("nodemailer");

const SMTP_USER = process.env.SMTP_USER || "sureshgobi34@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "cmdmssbgqzqlfgsx";

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
        from: "sureshgobi34@gmail.com",
        to: email,
        subject: "Email Verification",
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
