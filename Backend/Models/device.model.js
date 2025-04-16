/**
 * Mongoose schema definition for a Device.
 * Represents a device with a name, a unique ThingSpeak channel ID, and a location.
 *
 * @typedef {Object} Device
 * @property {string} name - The name of the device. This field is required.
 * @property {string} thingSpeakChannelId - The unique ThingSpeak channel ID associated with the device. This field is required and must be unique.
 * @property {Object} location - The geographical location of the device.
 * @property {number} location.latitude - The latitude of the device's location. This field is required.
 * @property {number} location.longitude - The longitude of the device's location. This field is required.
 */
const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  thingSpeakChannelId: { type: String, unique: true, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});


module.exports = mongoose.model("Device", DeviceSchema);