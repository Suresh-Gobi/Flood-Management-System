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
