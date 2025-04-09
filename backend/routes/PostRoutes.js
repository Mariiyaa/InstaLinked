const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

router.get("/:id", async (req, res) => {
  try {
    const postDocument = await Post.findOne({"posts._id": new mongoose.Types.ObjectId(req.params.id) });
    const post = postDocument.posts.find(p => p._id.toString() === req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Get user information
    const user = await User.findOne({ email: postDocument.user_email });
    
    // Add user information to the post
    const postWithUser = {
      ...post.toObject(),
      user: {
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        occupation: user.occupation,
        persona: user.persona,
      }
    };

    res.json(postWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/like", async (req, res) => {
    try {
      const { email, name } = req.body;
      console.log("postId: ",req.params.id)
      
  
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const postDocument = await Post.findOne({"posts._id": new mongoose.Types.ObjectId(req.params.id) });


      const post = postDocument.posts.find(p => p._id.toString() === req.params.id);

      console.log("Found post:", post);
      const userIndex = post.likes.findIndex(like => like.email === email);
      if (userIndex === -1) {
          post.likes.push({ email, name });
      } else {
          post.likes.splice(userIndex, 1);
      }

      await postDocument.save(); // Save the entire document

      res.json({ likes: post.likes });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Comment on a post
  router.post("/:id/comment", async (req, res) => {
    try {
      const { email, name, text } = req.body;
      const postDocument = await Post.findOne({"posts._id": new mongoose.Types.ObjectId(req.params.id) });


      const post = postDocument.posts.find(p => p._id.toString() === req.params.id);
      console.log("Found post:", post);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.comments.push({ email, name, text, createdAt: new Date() });

      await postDocument.save();
  
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Share a post
  router.post("/:id/share", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.shares += 1;
      await post.save();
  
      res.json({ shares: post.shares });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;