const axios = require("axios");
const Device = require("../Models/device.model");
const ThingSpeakData = require("../Models/ThingSpeakData");

const API_KEY = "Z5OGMVIFH683U3V1";
const BASE_URL = "https://api.thingspeak.com/channels";

// ✅ Get all data for a specific device
const getDeviceData = async (req, res) => {
  try {
    console.log("Fetching devices from MongoDB..."); // Debug Log
    const devices = await Device.find();

    if (!devices.length) {
      console.log("No devices found.");
      return res.status(404).json({ success: false, message: "No devices found" });
    }

    console.log(`Found ${devices.length} devices. Fetching data from ThingSpeak...`);

    // Fetch and save data for all devices
    const deviceDataPromises = devices.map(async (device) => {
      try {
        console.log(`Fetching data for Device: ${device.name} (ID: ${device._id})`);

        const response = await axios.get(`${BASE_URL}/${device.thingSpeakChannelId}/feeds.json`, {
          params: { api_key: API_KEY, results: 10 }, // Fetch last 10 results for testing
        });

        const feeds = response.data.feeds;
        console.log(`Received ${feeds.length} entries from ThingSpeak for ${device.name}`);

        if (!feeds || feeds.length === 0) {
          console.log(`No data available for ${device.name}`);
          return {
            deviceId: device._id,
            name: device.name,
            latitude: device.location?.latitude,
            longitude: device.location?.longitude,
            data: [],
            error: "No data available",
          };
        }

        // Save each entry to MongoDB
        const savePromises = feeds.map(async (entry) => {
          try {
            const newEntry = new ThingSpeakData({
              deviceId: device._id,
              entryId: entry.entry_id,
              createdAt: new Date(entry.created_at),
              waterLevel: entry.field1 ? parseFloat(entry.field1) : null,
              rainingStatus: entry.field2 || "Unknown",
              temperature: entry.field3 ? parseFloat(entry.field3) : null,
              airPressure: entry.field4 ? parseFloat(entry.field4) : null,
              waterfallLevel: entry.field5 ? parseFloat(entry.field5) : null,
              latitude: entry.latitude ? parseFloat(entry.latitude) : null,
              longitude: entry.longitude ? parseFloat(entry.longitude) : null,
              elevation: entry.elevation ? parseFloat(entry.elevation) : null,
              status: entry.status || "Unknown",
            });

            console.log("Saving data:", newEntry);

            await newEntry.save(); // Save to MongoDB

            console.log("Data saved successfully!");
          } catch (saveError) {
            console.error("Error saving data to MongoDB:", saveError.message);
          }
        });

        await Promise.all(savePromises); // Wait for all saves to complete

        return {
          deviceId: device._id,
          name: device.name,
          latitude: device.location?.latitude,
          longitude: device.location?.longitude,
          totalEntries: feeds.length,
        };
      } catch (fetchError) {
        console.error(`Error fetching data for device ${device.name}:`, fetchError.message);
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

    console.log("Data fetch and save process complete.");

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
