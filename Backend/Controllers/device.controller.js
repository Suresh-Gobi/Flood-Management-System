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

// ✅ Get device by ID
const getAllDevices = async (req, res) => {
  try {
    // Find all devices
    const devices = await Device.find();

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error getting devices:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get devices",
    });
  }
};

// ✅ Update device by ID
const updateDeviceById = async (req, res) => {
  try {
      const { id } = req.params;
      const { name, thingSpeakChannelId, location } = req.body;

      if (!name || !thingSpeakChannelId || !location || !location.latitude || !location.longitude) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const updatedDevice = await Device.findByIdAndUpdate(
          id,
          { name, thingSpeakChannelId, location },
          { new: true }
      );

      if (!updatedDevice) {
          return res.status(404).json({ success: false, message: "Device not found" });
      }

      res.json({ success: true, message: "Device updated successfully", data: updatedDevice });
  } catch (error) {
      console.error("Error updating device:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addDevice, getAllDevices, updateDeviceById };

