const express = require("express");
const {
  getDeviceData,
  getFieldData,
  getChannelStatus,
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
} = require("../Controllers/device.controller");

const router = express.Router();

router.get("/flood", getDeviceData);

router.get("/flood/:field", getFieldData);

router.get("/flood-channel-status", getChannelStatus);

router.get("/rain", getSensorData);
router.get("/rain/:field", rainGetDeviceData);
router.get("/rain-channel-status", getChannelInfo);

router.post("/add-device", addDevice);

router.get("/getall-device", getAllDevices);

router.put("/update-device/:id", updateDeviceById);

module.exports = router;
