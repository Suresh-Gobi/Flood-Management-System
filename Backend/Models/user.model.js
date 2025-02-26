const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  otp: { type: String, required: false },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  phone_number: { type: String, default: null },
  date_of_birth: { type: String, default: null },
  address: { type: String, default: null },
  role: { type: String, default: "user" },
  resetPasswordOTP: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  longitude: { type: Number, default: null },
  latitude: { type: Number, default: null },
  street1: { type: String, default: null },
  street2: { type: String, default: null },
  city: { type: String, default: null },
  province: { type: String, default: null },
  district: { type: String, default: null },
  postal_code: { type: String, default: null },
  country: { type: String, default: null },
});

const User = mongoose.model("User", UserSchema);

// Function to create default admin
async function createDefaultAdmin() {
  const existingAdmin = await User.findOne({ role: "admin" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const adminUser = new User({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Default admin user created successfully.");
  }
}

createDefaultAdmin().catch((err) => console.error("Error creating admin:", err));

module.exports = User;
