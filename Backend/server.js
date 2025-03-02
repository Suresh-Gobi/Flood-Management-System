const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const deviceRoutes = require("./routes/device.route");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const { startDeviceDataUpdates } = require("./Controllers/floodsensor.controller");

const {checkLatestData} = require("./Controllers/disasteralert.controller");

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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});
