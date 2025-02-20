const axios = require("axios");

const API_KEY = "M5ZAQE2XCSVBJCS1";
const CHANNEL_ID = "2831972";
const BASE_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}`;


const getSensorData = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/feeds.json`, {
            params: { api_key: API_KEY, results: 2 },
        });

        res.status(200).json({
            success: true,
            data: response.data.feeds,
        });
    } catch (error) {
        console.error("Error fetching sensor data:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor data",
        });
    }
};


const  rainGetDeviceData = async (req, res) => {
    try {
        const fieldNumber = req.params.field; 
        const response = await axios.get(`${BASE_URL}/fields/${fieldNumber}.json`, {
            params: { api_key: API_KEY, results: 2 },
        });

        res.status(200).json({
            success: true,
            field: fieldNumber,
            data: response.data.feeds,
        });
    } catch (error) {
        console.error("Error fetching field data:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve field data",
        });
    }
};

const getChannelInfo = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/status.json`, {
            params: { api_key: API_KEY },
        });

        res.status(200).json({
            success: true,
            status: response.data,
        });
    } catch (error) {
        console.error("Error fetching channel status:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve channel status",
        });
    }
};

module.exports = { getSensorData, rainGetDeviceData, getChannelInfo };
