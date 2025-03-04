const { timeStamp } = require("console");
const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.params;
    
        // ✅ Fetch messages where sender and receiver match
        const messages = await Message.find({
          $or: [
            { sender, receiver }, // Messages sent by sender to receiver
            { sender: receiver, receiver: sender }, // Messages sent by receiver to sender
          ],
        }).sort({ updatedAt: 1 });
        console.log(messages) // Optional: Sort by time
    
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
      }
  };
  
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};