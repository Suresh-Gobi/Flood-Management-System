/**
 * Creates a default admin user in the database if no admin user already exists.
 * 
 * This function checks for the existence of a user with the role "admin". If no such user exists,
 * it creates a new admin user with default credentials (username: "admin", email: "admin@gmail.com",
 * password: "admin123"). The password is hashed using bcrypt before saving the user to the database.
 * 
 * @async
 * @function createDefaultAdmin
 * @returns {Promise<void>} Resolves when the default admin user is created or already exists.
 * @throws {Error} Logs an error if there is an issue during the creation of the admin user.
 */
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
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  street1: { type: String, default: null },
  street2: { type: String, default: null },
  city: { type: String, default: null },
  province: { type: String, default: null },
  district: { type: String, default: null },
  postal_code: { type: String, default: null },
  country: { type: String, default: null },
});

const User = mongoose.model("User", UserSchema);


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
