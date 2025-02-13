const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    allowNull: true,
  },
  last_name: {
    type: String,
    allowNull: true,
  },
  phone_number: {
    type: String,
    allowNull: true,
  },
  date_of_birth: {
    type: String,
    allowNull: true,
  },
  address: {
    type: String,
    allowNull: true,
  },
  role: {
    type: String,
    defaultValue: "admin",
  },
  resetPasswordOTP: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
