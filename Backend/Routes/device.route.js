

/**
 * Express router for handling device-related routes in the Flood Management System.
 * 
 * Routes:
 * - GET /flood: Retrieves flood sensor device data.
 * - GET /flood/:field: Retrieves specific field data from flood sensors.
 * - GET /flood-channel-status: Retrieves the channel status of flood sensors.
 * - GET /get-thinkspeakdata: Retrieves ThingSpeak data directly (requires authentication and authorization for "admin" or "user" roles).
 * - GET /get-thinkspeakdatabyid/:deviceId: Retrieves all ThingSpeak data by device ID.
 * - GET /rain: Retrieves rainfall sensor data.
 * - GET /rain/:field: Retrieves specific field data from rainfall sensors.
 * - GET /rain-channel-status: Retrieves the channel status of rainfall sensors.
 * - POST /add-device: Adds a new device (requires authentication and authorization for "admin" role).
 * - GET /getall-device: Retrieves all devices (requires authentication and authorization for "admin" role).
 * - PUT /update-device/:id: Updates a device by its ID.
 * - DELETE /delete-device/:id: Deletes a device by its ID (requires authentication and authorization for "admin" role).
 * 
 * Middleware:
 * - `authMiddleware`: Ensures the user is authenticated.
 * - `authorize(roles)`: Ensures the user has the required role(s) for the route.
 * 
 * Controllers:
 * - Flood Sensor: `getDeviceData`, `getFieldData`, `getChannelStatus`, `getAllThingSpeakDataByID`, `getThingSpeakDataDirect`.
 * - Rainfall Sensor: `getSensorData`, `rainGetDeviceData`, `getChannelInfo`.
 * - Device: `addDevice`, `getAllDevices`, `updateDeviceById`, `deleteDeviceById`.
 * 
 * @module Routes/device.route
 */
const express = require("express");
const {
  getDeviceData,
  getFieldData,
  getChannelStatus,
  getAllThingSpeakDataByID,
  getThingSpeakDataDirect,
} = require("../Controllers/floodsensor.controller");

const {
  getSensorData,
  rainGetDeviceData,
  getChannelInfo,
} = require("../Controllers/rainfallsensor.controller");

const {
  addDevice,
  getAllDevices,
  updateDeviceById,
  deleteDeviceById,
} = require("../Controllers/device.controller");
const authMiddleware = require("../Utils/auth");
const authorize = require("../Utils/roleauth");

const router = express.Router();

router.get("/flood", getDeviceData);

router.get("/flood/:field", getFieldData);

router.get("/flood-channel-status", getChannelStatus);

router.get("/get-thinkspeakdata",authMiddleware, authorize(["admin","user"]), getThingSpeakDataDirect);

router.get("/get-thinkspeakdatabyid/:deviceId", getAllThingSpeakDataByID);

// router.get("/get-thinkspeakdata", getAllThingSpeakData);

router.get("/rain", getSensorData);
router.get("/rain/:field", rainGetDeviceData);
router.get("/rain-channel-status", getChannelInfo);

router.post("/add-device",authMiddleware, authorize(["admin"]), addDevice);

router.get("/getall-device",authMiddleware, authorize(["admin"]), getAllDevices);

router.put("/update-device/:id", updateDeviceById);

router.delete("/delete-device/:id",authMiddleware, authorize(["admin"]), deleteDeviceById);

module.exports = router;
