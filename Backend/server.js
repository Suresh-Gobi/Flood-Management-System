const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const deviceRoutes = require("./Routes/device.route");
require("dotenv").config();


// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors({ origin: "*" }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// AllRoutes
app.use("/api", userRoutes);
app.use("/api/device", deviceRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
