const { timeStamp } = require("console");
const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
      const { sender, receiver } = req.params;

      // ✅ Get messages from the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const messages = await Message.find({
          $or: [
              { sender, receiver },
              { sender: receiver, receiver: sender },
          ],
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

  
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message, isRead, sharedPost } = req.body;
    const newMessage = new Message({ sender, receiver, message, isRead: false, sharedPost });
   
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};