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

const router = express.Router();

router.get("/flood", getDeviceData);

router.get("/flood/:field", getFieldData);

router.get("/flood-channel-status", getChannelStatus);

router.get("/get-thinkspeakdata", getThingSpeakDataDirect);

router.get("/get-thinkspeakdatabyid/:deviceId", getAllThingSpeakDataByID);

// router.get("/get-thinkspeakdata", getAllThingSpeakData);

router.get("/rain", getSensorData);
router.get("/rain/:field", rainGetDeviceData);
router.get("/rain-channel-status", getChannelInfo);

router.post("/add-device", addDevice);

router.get("/getall-device", getAllDevices);

router.put("/update-device/:id", updateDeviceById);

router.delete("/delete-device/:id", deleteDeviceById);

module.exports = router;
