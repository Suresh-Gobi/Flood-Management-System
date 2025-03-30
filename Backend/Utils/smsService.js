const axios = require("axios");

const NOTIFY_LK_API_KEY = process.env.NOTIFY_LK_API_KEY || "qU0cxbHf8NZabci5T4ez";
const NOTIFY_LK_USER_ID = process.env.NOTIFY_LK_USER_ID || "29296";
const NOTIFY_LK_SENDER_ID = process.env.NOTIFY_LK_SENDER_ID || "NotifyDEMO";

const sendSms = async (phone_number, message) => {
    try {
        if (!phone_number.startsWith("+")) {
            phone_number = `94${phone_number.replace(/^0+/, "")}`;
        }

        const response = await axios.get("https://app.notify.lk/api/v1/send", {
            params: {
                user_id: NOTIFY_LK_USER_ID,
                api_key: NOTIFY_LK_API_KEY,
                sender_id: NOTIFY_LK_SENDER_ID,
                to: phone_number,
                message: message,
            },
        });

        console.log("SMS sent:", response.data);
    } catch (error) {
        console.error("Error sending SMS:", error.response ? error.response.data : error.message);
    }
};

module.exports = { sendSms };
