const mongoose = require("mongoose");

const WaterDataSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  waterLevel: Number,
  rainingStatus: String,
  temperature: Number,
  airPressure: Number,
  waterfallLevel: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WaterData", WaterDataSchema);
