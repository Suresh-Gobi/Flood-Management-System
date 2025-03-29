const twilio = require("twilio");

const TWILIO_SID = process.env.TWILIO_SID || "AC7f386bf22f9dc54a2c1fcdf80518ec2d";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "5544237ced72dc9faf6178e5b7966e26";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+16163444654";

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const sendSms = async (phone_number, message) => {
    try {
        if (!phone_number.startsWith("+")) {
            phone_number = `+94${phone_number.replace(/^0+/, "")}`;
        }

        const response = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: phone_number,
        });

        console.log("SMS sent:", response.sid);
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};

module.exports = { sendSms };
