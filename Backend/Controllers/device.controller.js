const Device = require("../Models/device.model"); // Import your Mongoose model

// ✅ Add a new device
const addDevice = async (req, res) => {
  try {
    const { name, thingSpeakChannelId, latitude, longitude } = req.body;

    // Check if all required fields are provided
    if (!name || !thingSpeakChannelId || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create new device
    const newDevice = new Device({
      name,
      thingSpeakChannelId,
      location: { latitude, longitude },
    });

    // Save device to database
    await newDevice.save();

    res.status(201).json({
      success: true,
      message: "Device added successfully",
      data: newDevice,
    });
  } catch (error) {
    console.error("Error adding device:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add device",
    });
  }
};

module.exports = { addDevice };
