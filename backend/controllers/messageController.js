const { timeStamp } = require("console");
const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.params;
    
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        // ✅ Fetch messages within the past 3 months
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
            
        }).sort({ createdAt: 1 });

        console.log(messages);
        
        const unreadMessageIds = messages
        .filter(msg => msg.isRead === false) // ✅ Only mark messages from sender as read
        .map(msg => msg);


        console.log("XXXXXXXXXXXXXXXXXXX:",unreadMessageIds)
    if (unreadMessageIds.length > 0) {
        await Message.updateMany(
            { _id: { $in: unreadMessageIds } },
            { $set: { isRead: true } }
        );

    }
const updatedMessages = await Message.find({
    $or: [
        { sender, receiver }, // Messages sent by sender to receiver
        { sender: receiver, receiver: sender }, // Messages sent by receiver to sender
    ],
    createdAt: { $gte: threeMonthsAgo }  
}).sort({ createdAt: 1 }); // Sort messages by time

console.log("Updated Messages:", updatedMessages);

res.json(updatedMessages)
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
      }
  };
  
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message,isRead } = req.body;
    const newMessage = new Message({ sender, receiver, message, isRead: false });
    console.log("messagess---------------------------------->",newMessage) 
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};