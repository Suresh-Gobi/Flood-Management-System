/**
 * Fetches the latest data from the ThingSpeakData collection, checks for water level
 * and rain status alerts, and sends notifications to nearby users if necessary.
 *
 * - Retrieves the most recent data entry from the database.
 * - Checks if the water level exceeds the defined threshold.
 * - Checks if the rain status matches the defined threshold.
 * - Identifies users within a 10km radius of the device's location.
 * - Sends email and SMS alerts to nearby users if an alert is triggered.
 *
 * @async
 * @function checkLatestData
 * @returns {Promise<void>} Resolves when the data check and notifications are complete.
 * @throws {Error} Logs any errors encountered during the process.
 */
const mongoose = require("mongoose");
const axios = require("axios");
const ThingSpeakData = require("../Models/ThingSpeakData");
const Device = require("../Models/device.model");
const User = require("../Models/user.model");
const { sendVerificationEmail } = require("../utils/email-alert");
const { sendSms } = require("../utils/smsService");

const API_KEY = "Z5OGMVIFH683U3V1";
const BASE_URL = "https://api.thingspeak.com/channels";
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


const fetchAlert = async () => {
  try {
    // Get the device data from the Device model
    const device = await Device.findOne();
    if (!device) {
      console.warn("⚠️ No device found in the database.");
      return;
    }

    const { thingSpeakChannelId, location } = device;
    const { latitude, longitude } = location;

    if (!thingSpeakChannelId || !latitude || !longitude) {
      console.warn("⚠️ Missing device data (thingSpeakChannelId, latitude, or longitude).");
      return;
    }

    // Fetch the latest field5 data from ThingSpeak API using the device's channel ID
    const url = `https://api.thingspeak.com/channels/${thingSpeakChannelId}/fields/5.json`;
    const response = await axios.get(url, {
      params: {
        api_key: API_KEY,
        results: 1, // Get the most recent data
      },
    });

    const feeds = response.data?.feeds;
    const field5 = feeds?.[0]?.field5;

    if (field5 === undefined || field5 === null) {
      console.warn("⚠️ No field5 data available.");
      return;
    }

    const field5Value = parseInt(field5);

    if (field5Value === 1) {
      console.log("🚨 field5 = 1 detected. Sending alerts...");

      // Get the nearby users based on the device location
      const nearbyUsers = await getNearbyUsers({ latitude, longitude });

      if (nearbyUsers.length === 0) {
        console.log("❌ No nearby users to notify.");
        return;
      }

      const alertMessage = `🚨 Alert: Water level has increased significantly! Flood alert triggered. Please take necessary precautions.`;

      // Send SMS alerts to nearby users
      // const smsPromises = nearbyUsers.map((user) =>
      //   sendSms(user.phone_number, alertMessage)
      // );

      // const emailPromises = nearbyUsers.map((user) =>
      //   sendVerificationEmail(user.email, alertMessage)
      // );

      await Promise.all(smsPromises, emailPromises);

      console.log(`✅ SMS alerts sent to ${nearbyUsers.length} users.`);
    } else {
      console.log(`✅ field5 = ${field5Value}. No alert needed.`);
    }
  } catch (error) {
    console.error("❌ Error in fetchAlert:", error.message);
  }
};

setInterval(fetchAlert, FETCH_INTERVAL);
console.log(
  "🚀 ThingSpeak data monitoring started. Checking every 10 seconds..."
);

// const checkLatestData = async () => {
//   try {
//     const latestData = await ThingSpeakData.findOne()
//       .sort({ createdAt: -1 })
//       .populate("deviceId");

//     if (!latestData) {
//       console.log("⚠️ No data found in ThingSpeakData.");
//       return;
//     }

//     const { deviceId, waterLevel, rainingStatus, createdAt } = latestData;

//     if (!deviceId || !deviceId.location) {
//       console.log(`⚠️ Device has no location data.`);
//       return;
//     }

//     const { name, location } = deviceId;
//     const { latitude, longitude } = location;

//     if (latitude === undefined || longitude === undefined) {
//       // console.log(`⚠️ Device ${name} has no latitude/longitude values.`);
//       return;
//     }

//     // console.log(`📡 Device: ${name} (ID: ${deviceId._id})`);
//     // console.log(`📍 Location: Lat ${latitude}, Long ${longitude}`);
//     // console.log(`📅 Timestamp: ${createdAt}`);
//     // console.log(`🌊 Water Level: ${waterLevel !== null ? waterLevel : "N/A"}`);
//     // console.log(`🌧️ Rain Status: ${rainingStatus !== null ? rainingStatus : "N/A"}`);

//     let alertMessage = "";

//     // Check for water level alert
//     if (waterLevel !== null && waterLevel >= WATER_LEVEL_THRESHOLD) {
//       alertMessage += `🚨 HIGH WATER LEVEL detected at ${name}! Level: ${waterLevel} meters.\n`;
//       console.log(alertMessage);
//     }

//     // Check for rain status alert
//     if (rainingStatus !== null && parseInt(rainingStatus) === RAIN_THRESHOLD) {
//       alertMessage += `🌧️ It's RAINING at ${name}!\n`;
//       console.log(alertMessage);
//     }

//     // If an alert was triggered, notify users nearby
//     if (alertMessage) {
//       const nearbyUsers = await getNearbyUsers({ latitude, longitude });

//       if (nearbyUsers.length > 0) {
//         console.log(`Sending alerts to ${nearbyUsers.length} users nearby...`);

//         const emailPromises = nearbyUsers.map((user) =>
//           sendVerificationEmail(user.email, alertMessage)
//         );
//         // const smsPromises = nearbyUsers.map((user) =>
//         //   sendSms(user.phone_number, alertMessage)
//         // );

//         await Promise.all([...emailPromises, ...smsPromises]);

//         console.log("✅ All email and SMS notifications sent successfully!");
//       } else {
//         console.log("No users found within 10km radius.");
//       }
//     }

//     console.log("Data check complete.\n");
//   } catch (error) {
//     console.error("rror fetching ThingSpeakData:", error.message);
//   }
// };

// setInterval(checkLatestData, FETCH_INTERVAL);

// console.log(
//   "🚀 ThingSpeak data monitoring started. Checking every 10 seconds..."
// );


module.exports = {fetchAlert };
