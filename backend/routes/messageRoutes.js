const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const { getMessages, sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.get("/:sender/:receiver", getMessages);
router.post("/send", sendMessage);


router.post("/latest", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email",req.body)

    const latestMessages = await Message.aggregate([
      // Match messages where the user is either sender or receiver
      {
        $match: {
          $or: [{ sender: email }, { receiver: email }],
        },
      },
      // Sort by latest createdAt timestamp
      { $sort: { createdAt: -1 } },
      // Group by unique conversation (ensuring both sender and receiver are considered)
      {
        $group: {
          _id: {
            participant1: { $min: ["$sender", "$receiver"] }, // Ensures consistent ordering of users
            participant2: { $max: ["$sender", "$receiver"] },
          },
          lastMessage: { $first: "$message" }, // Latest message
          isRead: { $first: "$isRead" }, // Read status
          timestamp: { $first: "$createdAt" }, // Latest timestamp
          sender: { $first: "$sender" }, // Message sender
          receiver: { $first: "$receiver" }, // Message receiver
        },
      },
      // Determine the other user in the conversation
      {
        $project: {
          _id: 0,
          email: {
            $cond: {
              if: { $eq: ["$sender", email] },
              then: "$receiver",
              else: "$sender",
            },
          }, // Get the other participant
          lastMessage: 1,
          isRead: 1,
          timestamp: 1,
          sender: 1,
          receiver: 1,
        },
      },
      // Lookup user details from the User collection
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userDetails",
        },
      },
      // Unwind userDetails array
      { $unwind: "$userDetails" },
      // Final projection
      {
        $project: {
          email: 1,
          fullName: "$userDetails.fullName",
          profileImage: "$userDetails.profileImage",
          lastMessage: 1,
          isRead: 1,
          timestamp: 1,
          sender: 1,
          receiver: 1,
        },
      },
      // Sort conversations by latest timestamp
      { $sort: { timestamp: -1 } },
    ]);
    
    res.json(latestMessages);
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mark all messages as read when a chat is opened


module.exports = router;
