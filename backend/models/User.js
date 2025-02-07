const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  phone: { type: String}, // Sparse allows multiple nulls.
  email: { type: String },
  persona: { type: [String], enum: ['Heritage Lover', 'Explorer', 'Researcher', 'Practitioner', 'Conservator', 'Artist'], default: null },    
  contentPreferences: { type: [String], default: [] },
  password: { type: String}, // Password should always be required.
  fullName: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  externalLinks: { type: [String] },
  otp:{type: String},
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});


module.exports = mongoose.model('User', userSchema);
