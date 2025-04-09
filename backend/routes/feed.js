const express = require("express");
const { homePage } = require('../controllers/homeController');
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Fetch user data by email
router.get("/user/data", async (req, res) => {
  console.log("Received Request Headers:", req.headers);
  console.log("Received Request Query:", req.query);
  console.log("Received Request Body:", req.body);
  
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("Fetching feed for email:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      profileImage: user.profileImage,
      email: user.email,
      _id: user._id
    });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch homepage posts
router.get('/feed/homepage', async (req, res) => {
  try {
    const { email } = req.query;
    console.log("Fetching posts for email:", email);

    // Build the match query
    const matchQuery = email ? { user_email: email } : {};
    console.log("Match query:", matchQuery);

    // Fetch posts with the appropriate query
    const posts = await Post.aggregate([
      { $match: matchQuery },
      { $unwind: "$posts" },
      {
        $lookup: {
          from: "users",
          localField: "user_email",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$posts._id",
          url: "$posts.url",
          caption: "$posts.caption",
          content_type: "$posts.content_type",
          category: "$posts.category",
          hashtags: "$posts.hashtags",
          tags: "$posts.tags",
          visibility: "$posts.visibility",
          created_at: "$posts.created_at",
          likes: "$posts.likes",
          comments: "$posts.comments",
          user_email: 1,
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            profileImage: "$user.profileImage",
            email: "$user.email"
          }
        }
      },
      { $sort: { created_at: -1 } }
    ]);

    console.log(`Found ${posts.length} posts for ${email || 'homepage'}`);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;