const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  sharedPost: {
    type: {
      _id: String,
      image: String,
      content_type: {
        type: String,
        enum: ['Image', 'Documentary', 'Pdf', 'Reel'],
        required: true
      },
      author: {
        name: String,
        email: String,
        profileImage: String
      },
      caption: String,
      createdAt: Date
    },
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);