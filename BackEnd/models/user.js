const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // You can use bcryptjs or bcrypt

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce a minimum length for passwords
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
