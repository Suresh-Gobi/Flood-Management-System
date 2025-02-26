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
