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
