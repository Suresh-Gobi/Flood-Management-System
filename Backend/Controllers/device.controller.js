

/**
 * Adds a new device to the database.
 * 
 * @async
 * @function addDevice
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the device.
 * @param {string} req.body.thingSpeakChannelId - The ThingSpeak channel ID of the device.
 * @param {number} req.body.latitude - The latitude of the device's location.
 * @param {number} req.body.longitude - The longitude of the device's location.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the status and the newly created device or an error message.
 */

/**
 * Retrieves all devices from the database.
 * 
 * @async
 * @function getAllDevices
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the list of devices or an error message.
 */

/**
 * Updates a device by its ID.
 * 
 * @async
 * @function updateDeviceById
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the device to update.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The updated name of the device.
 * @param {string} req.body.thingSpeakChannelId - The updated ThingSpeak channel ID of the device.
 * @param {Object} req.body.location - The updated location of the device.
 * @param {number} req.body.location.latitude - The updated latitude of the device's location.
 * @param {number} req.body.location.longitude - The updated longitude of the device's location.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the updated device or an error message.
 */

/**
 * Deletes a device by its ID.
 * 
 * @async
 * @function deleteDeviceById
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the device to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the deletion status or an error message.
 */
const Device = require("../Models/device.model"); 

// Add a new device
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

// Get device by ID
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

// Update device by ID
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

// Delete device by ID
const deleteDeviceById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDevice = await Device.findByIdAndDelete(id);

    if (!deletedDevice) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addDevice, getAllDevices, updateDeviceById, deleteDeviceById };

