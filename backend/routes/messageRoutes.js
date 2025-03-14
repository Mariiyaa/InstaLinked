const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const { getMessages, sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.get("/:sender/:receiver", getMessages);
router.post("/send", sendMessage);

// Fetch latest message for each conversation
router.get("/latest-messages", async (req, res) => {
  try {
    const latestMessages = await Message.aggregate([
      {
        $sort: { createdAt: -1 } // Sort messages by latest first
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: ["$sender", "$receiver"] }, // Ensure unique sender-receiver pair
              then: { sender: "$sender", receiver: "$receiver" },
              else: { sender: "$receiver", receiver: "$sender" }
            }
          },
          messageId: { $first: "$_id" },
          lastMessage: { $first: "$message" },
          lastMessageTime: { $first: "$createdAt" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
          isRead: { $first: "$isRead" }
        }
      }
    ]);
console.log(latestMessages)
    res.json(latestMessages);
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/mark-as-read", async (req, res) => {
    try {
      const { messageIds } = req.body;
      console.log("****************88",messageIds) // Array of message IDs
  
      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({ error: "Invalid request data" });
      }
  
      const result = await Message.updateMany(
        { _id: { $in: messageIds },  $or: [{ isRead: false }, { isRead: null }] }, // Update only unread messages
        { $set: { isRead: true } }
      );
      console.log("------------------>",result);
      res.json({ success: true, updatedCount: result.modifiedCount });
      
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
