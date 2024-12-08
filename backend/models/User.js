// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  budget: {
    type: Number,
    required: true,
    default: 0.0 // Default balance to 0.0
  },
  balance: {
    type: Number,
    required: true,
    default: 0.0 // Default savings to 0.0
  }
});

module.exports = mongoose.model('User', userSchema);
