const mongoose = require("mongoose");

const ThingSpeakDataSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  entryId: { type: Number, required: true }, // Unique entry ID from ThingSpeak
  createdAt: { type: Date, required: true }, // Timestamp from ThingSpeak
  waterLevel: Number, // field1
  rainingStatus: String, // field2
  temperature: Number, // field3
  airPressure: Number, // field4
  waterfallLevel: Number, // field5
  latitude: Number,
  longitude: Number,
  elevation: Number,
  status: String,
});

module.exports = mongoose.model("ThingSpeakData", ThingSpeakDataSchema);
