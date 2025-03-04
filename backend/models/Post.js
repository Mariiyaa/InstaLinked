const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_email: {
    type: String, // Reference to the user ID
    required: true,
    ref: 'User',
  },
  posts: [
    {
      url: {
        type: String, // URL for image/video/article
        required: true,
      },
      caption: {
        type: String, // Caption for the post
        default: '',
      },
      content_type: {
        type: String, // Type of content (e.g., 'image', 'video', 'article')
        required: true,
         // Valid content types
      },
      category:{
        type:String,
        required:true,
        default:'',
      },
      hashtags:{
        type:[String],
        default:'',
      },
      tags:{
        type:String,
        default:'',
      },
      visibility:{
        type:String,
        default:'',
      },
      created_at: {
        type: Date, // Timestamp for when the post was created
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;