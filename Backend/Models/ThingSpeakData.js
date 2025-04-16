
/**
 * Mongoose schema for ThingSpeakData.
 * Represents data collected from a ThingSpeak device.
 *
 * @typedef {Object} ThingSpeakData
 * @property {mongoose.Schema.Types.ObjectId} deviceId - Reference to the associated device (required).
 * @property {number} entryId - Unique entry ID for the data (required).
 * @property {Date} createdAt - Timestamp when the data was created (required).
 * @property {number} [waterLevel] - Water level measurement.
 * @property {string} [rainingStatus] - Status indicating whether it is raining.
 * @property {number} [temperature] - Temperature measurement.
 * @property {number} [airPressure] - Air pressure measurement.
 * @property {number} [waterfallLevel] - Waterfall level measurement.
 * @property {number} [latitude] - Latitude coordinate of the device.
 * @property {number} [longitude] - Longitude coordinate of the device.
 * @property {number} [elevation] - Elevation of the device location.
 * @property {string} [status] - Status of the data or device.
 */
const mongoose = require("mongoose");

const ThingSpeakDataSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  entryId: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  waterLevel: Number,
  rainingStatus: String,
  temperature: Number,
  airPressure: Number,
  waterfallLevel: Number,
  latitude: Number,
  longitude: Number,
  elevation: Number,
  status: String,
});

module.exports = mongoose.model("ThingSpeakData", ThingSpeakDataSchema);
