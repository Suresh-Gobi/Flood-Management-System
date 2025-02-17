const axios = require("axios");
const Device = require("../Models/device.model");

const API_KEY = "Z5OGMVIFH683U3V1";
const BASE_URL = "https://api.thingspeak.com/channels";

// ✅ Get all data for a specific device
const getDeviceData = async (req, res) => {
  try {
    // Fetch all devices from MongoDB
    const devices = await Device.find();
    if (!devices.length) {
      return res.status(404).json({ success: false, message: "No devices found" });
    }

    // Fetch data for all devices from ThingSpeak
    const deviceDataPromises = devices.map(async (device) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/${device.thingSpeakChannelId}/feeds.json`,
          {
            params: { api_key: API_KEY },
          }
        );

        return {
          deviceId: device._id,
          name: device.name,
          latitude: device.location?.latitude,  // Correctly accessing latitude
          longitude: device.location?.longitude, // Correctly accessing longitude
          data: response.data.feeds,
        };
      } catch (error) {
        console.error(`Error fetching data for device ${device.name}:`, error.message);
        return {
          deviceId: device._id,
          name: device.name,
          latitude: device.location?.latitude,
          longitude: device.location?.longitude,
          data: [],
          error: "Failed to fetch data",
        };
      }
    });

    const allDeviceData = await Promise.all(deviceDataPromises);

    res.status(200).json({
      success: true,
      devices: allDeviceData,
    });
  } catch (error) {
    console.error("Error fetching all device data:", error.message);
    res.status(500).json({ success: false, message: "Failed to retrieve device data" });
  }
};


// ✅ Get specific field data (e.g., water level) for a device
const getFieldData = async (req, res) => {
  try {
    const { deviceId, field } = req.params;

    // Find the device in your MongoDB
    const device = await Device.findById(deviceId);
    if (!device) {
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    }

    // Fetch field-specific data
    const response = await axios.get(
      `${BASE_URL}/${device.thingSpeakChannelId}/fields/${field}.json`,
      {
        params: { api_key: API_KEY, results: 10 }, // Get last 10 results
      }
    );

    res.status(200).json({
      success: true,
      device: device.name,
      field,
      data: response.data.feeds,
    });
  } catch (error) {
    console.error("Error fetching field data:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve field data" });
  }
};

// ✅ Get the status of a specific device's channel
const getChannelStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Find the device in your MongoDB
    const device = await Device.findById(deviceId);
    if (!device) {
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    }

    // Fetch channel status
    const response = await axios.get(
      `${BASE_URL}/${device.thingSpeakChannelId}/status.json`,
      {
        params: { api_key: API_KEY },
      }
    );

    res.status(200).json({
      success: true,
      device: device.name,
      status: response.data,
    });
  } catch (error) {
    console.error("Error fetching channel status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve channel status" });
  }
};

module.exports = { getDeviceData, getFieldData, getChannelStatus };
