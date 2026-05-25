const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  role: {
    type: String,
    enum: ['customer', 'manager', 'kitchen', 'service', 'delivery', 'supplier'],
    default: 'customer',
  },
  phone: {
    type: String,
  },
  resetPasswordCodeHash: {
    type: String,
  },
  resetPasswordExpiresAt: {
    type: Date,
  },
  resetPasswordAttempts: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
