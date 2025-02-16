const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  thingSpeakChannelId: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Device", DeviceSchema);
