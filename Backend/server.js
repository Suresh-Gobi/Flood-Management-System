/**
 * Initializes and starts the Express server with WebSocket support.
 * 
 * - Sets up middleware for JSON parsing and CORS.
 * - Connects to a MongoDB database using the connection string from environment variables.
 * - Registers API routes for user and device management.
 * - Configures a WebSocket server using Socket.IO for real-time communication.
 * - Starts real-time device data updates and disaster alert fetching.
 * - Listens for incoming connections on the specified port.
 * 
 * @file server.js
 * @requires express - Web framework for Node.js.
 * @requires cors - Middleware for enabling Cross-Origin Resource Sharing.
 * @requires mongoose - MongoDB object modeling tool.
 * @requires dotenv - Loads environment variables from a .env file.
 * @requires http - Node.js HTTP server module.
 * @requires socket.io - Library for real-time WebSocket communication.
 * @requires ./routes/user.route - User-related API routes.
 * @requires ./routes/device.route - Device-related API routes.
 * @requires ./Controllers/floodsensor.controller - Controller for flood sensor data updates.
 * @requires ./Controllers/disasteralert.controller - Controller for disaster alert data fetching.
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const deviceRoutes = require("./routes/device.route");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const { startDeviceDataUpdates } = require("./Controllers/floodsensor.controller");

const {checkLatestData, fetchAlert} = require("./Controllers/disasteralert.controller");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", userRoutes);
app.use("/api/device", deviceRoutes);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start real-time updates
startDeviceDataUpdates(io);

// checkLatestData();
fetchAlert();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});
