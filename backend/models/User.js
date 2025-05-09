const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  fullName: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  phone: { type: String}, // Sparse allows multiple nulls.
  email: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  location: { type: String },
  occupation: { type: String },
  persona: { type: [String], enum: ['Heritage Lover', 'Explorer', 'Researcher', 'Practitioner', 'Conservator', 'Artist',''], default: null },    
  contentPreferences: { type: [String], default: [] },
  externalLinks: { type: [String] },
  password: { type: String},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Password should always be required.
  otp:{type: String},
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  isOnline: { type: Boolean, default: false },
});


module.exports = mongoose.model('User', userSchema);
