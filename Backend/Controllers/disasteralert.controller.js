const mongoose = require("mongoose");
const ThingSpeakData = require("../Models/ThingSpeakData");
const User = require("../Models/user.model");
const Device = require("../Models/device.model");

async function fetchData() {
  try {
    console.log("🔄 Fetching latest device data...");

    const users = await User.find({}, "email"); // Get user emails
    const devices = await Device.find({}, "name location"); // Get device names & locations

    console.log(`👥 Total Users: ${users.length}`);
    console.log(`📡 Total Devices: ${devices.length}`);

    if (devices.length === 0 || users.length === 0) {
      console.log("⚠️ No devices or users found.");
      return;
    }

    for (const device of devices) {
      console.log(`\n📡 Device: ${device.name} | 📍 Location: ${device.location}`);

      const latestData = await ThingSpeakData.findOne({ deviceId: device._id }).sort({ createdAt: -1 });

      if (!latestData) {
        console.log("⚠️ No data found.");
        continue;
      }

      console.log("📊 Latest ThingSpeak Data:", latestData);
    }

    console.log("👥 Users List:");
    users.forEach(user => console.log(`📧 Email: ${user.email}`));

  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
}

// Run the function every 30 seconds
console.log("🚀 Starting auto data fetch...");
fetchData();
setInterval(fetchData, 30 * 1000);
