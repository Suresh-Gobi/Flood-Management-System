const nodemailer = require("nodemailer");

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

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
        from: "sureshgobi34@gmail.com",
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
