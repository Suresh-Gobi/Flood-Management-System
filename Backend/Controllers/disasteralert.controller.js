const mongoose = require("mongoose");
const ThingSpeakData = require("../Models/ThingSpeakData");
const Device = require("../Models/device.model");
const User = require("../Models/user.model");
const { sendVerificationEmail } = require("../utils/email-alert");

const WATER_LEVEL_THRESHOLD = 0;
const RAIN_THRESHOLD = 1;
const FETCH_INTERVAL = 20000;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const getNearbyUsers = async (deviceLocation) => {
  try {
    const users = await User.find();
    return users.filter((user) => {
      if (!user.longitude || !user.latitude) return false;
      
      const distance = calculateDistance(
        deviceLocation.latitude, 
        deviceLocation.longitude, 
        user.latitude, 
        user.longitude
      );

    //   console.log(`User: ${user.username}, Distance: ${distance.toFixed(2)} km`);
      
      return distance <= 10;
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    return [];
  }
};



const checkLatestData = async () => {
  try {
    


    const latestData = await ThingSpeakData.findOne()
      .sort({ createdAt: -1 })
      .populate("deviceId");

    if (!latestData) {
      console.log("⚠️ No data found in ThingSpeakData.");
      return;
    }

    const { deviceId, waterLevel, rainingStatus, createdAt } = latestData;

    if (!deviceId || !deviceId.location) {
      console.log(`⚠️ Device has no location data.`);
      return;
    }

    const { name, location } = deviceId;
    const { latitude, longitude } = location;

    if (latitude === undefined || longitude === undefined) {
      // console.log(`⚠️ Device ${name} has no latitude/longitude values.`);
      return;
    }

    // console.log(`📡 Device: ${name} (ID: ${deviceId._id})`);
    // console.log(`📍 Location: Lat ${latitude}, Long ${longitude}`);
    // console.log(`📅 Timestamp: ${createdAt}`);
    // console.log(`🌊 Water Level: ${waterLevel !== null ? waterLevel : "N/A"}`);
    // console.log(`🌧️ Rain Status: ${rainingStatus !== null ? rainingStatus : "N/A"}`);

    let alertMessage = "";

    // Check for water level alert
    if (waterLevel !== null && waterLevel >= WATER_LEVEL_THRESHOLD) {
      alertMessage += `🚨 HIGH WATER LEVEL detected at ${name}! Level: ${waterLevel} meters.\n`;
      console.log(alertMessage);
    }

    // Check for rain status alert
    if (rainingStatus !== null && parseInt(rainingStatus) === RAIN_THRESHOLD) {
      alertMessage += `🌧️ It's RAINING at ${name}!\n`;
      console.log(alertMessage);
    }

    // If an alert was triggered, notify users nearby
    if (alertMessage) {
      const nearbyUsers = await getNearbyUsers({ latitude, longitude });

      if (nearbyUsers.length > 0) {
        // console.log(`Sending alerts to ${nearbyUsers.length} users nearby...`);
        nearbyUsers.forEach((user) => {
          sendVerificationEmail(user.email, alertMessage);
        });
      } else {
        console.log("No users found within 10km radius.");
      }
    }

    console.log("Data check complete.\n");
  } catch (error) {
    console.error("rror fetching ThingSpeakData:", error.message);
  }
};

setInterval(checkLatestData, FETCH_INTERVAL);

console.log("🚀 ThingSpeak data monitoring started. Checking every 10 seconds...");

module.exports = { checkLatestData };
