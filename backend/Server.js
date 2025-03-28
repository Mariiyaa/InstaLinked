const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const personaRoutes = require('./routes/persona');
const PostRoutes = require('./routes/PostRoutes');
const CreatePostRoute = require('./routes/CreatePostRoute');
const ContentSelectRoutes = require('./routes/ContentSelect');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require("socket.io");
const http = require("http");
const User =require('./models/User')

require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Optional, based on use case
  next();
});
app.use(express.json());

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL, // Allow requests from your frontend
  
}));


 const io = new Server(server, {
   cors: {
    credentials: true,
     origin: process.env.CLIENT_URL,
     methods: ["GET", "POST"],
     
   },
   transports: ["websocket", "polling"], // Ensure compatibility
   allowEIO3: true  // Allows older socket.io versions to connect
 });









app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api', personaRoutes);
app.use('/api', ContentSelectRoutes);
app.use('/api', CreatePostRoute);
app.use('/api/messages', messageRoutes);
app.use('/api/posts',PostRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
  })
  .catch((err) => console.error(err));

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB', process.env.MONGO_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

 const onlineUsers = new Map(); 

 io.on("connection", (socket) => {
   socket.on("sendMessage", async (data) => {
     const { sender, receiver, message,isRead } = data;
     const Message = require("./models/Message");

     const receiverSocketId = onlineUsers.get(receiver); // Assuming you store online users in a Map

  const isReceiverActive = receiverSocketId && activeChats.get(receiver) === sender; // Check if receiver is chatting with sender


     const newMessage = new Message({ sender, receiver, message,isRead: isReceiverActive });
     console.log(newMessage)
     await newMessage.save();
     io.emit("receiveMessage", {...data, _id: newMessage._id, isRead: isReceiverActive});
   });
   
   socket.on("markAsRead", async ({ sender, receiver }) => {
    try {
      const Message = require("./models/Message");
  
      // Update unread messages
      await Message.updateMany(
        { sender, receiver, isRead: false },
        { $set: { isRead: true } }
      );
  
      console.log(`✅ Messages from ${sender} to ${receiver} marked as read`);
  
      // Emit update to both users
      io.to(onlineUsers.get(sender)).emit("messagesRead", { sender, receiver });
      io.to(onlineUsers.get(receiver)).emit("messagesRead", { sender, receiver });
  
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  });


   socket.on("userOnline", async (email) => {
     if (email) {
       console.log(`✅ Marking user online: ${email}`);
      
       onlineUsers.set(email, socket.id);

       try {
         await User.updateOne({ email }, { $set: { isOnline: true } });

         // Fetch all users' online statuses
         const allUsers = await User.find({}, { email: 1, isOnline: 1 });

       

         // Emit all users' online status
         io.emit("updateUserStatus", allUsers);
       } catch (err) {
         console.error("❌ Error updating user status:", err);
       }
     }
   });

   // Handle user disconnecting
   socket.on("disconnect", async () => {
     let userEmail = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];

     if (userEmail) {
       console.log(`❌ Disconnected: ${userEmail}`);
      
       onlineUsers.delete(userEmail);

       try {
         await User.updateOne({ email: userEmail }, { $set: { isOnline: false } });

         // Fetch all users' online statuses
         const allUsers = await User.find({}, { email: 1, isOnline: 1 });

         console.log("📢 Emitting updated user status after disconnect:", allUsers);

         // Emit updated status to all clients
         io.emit("updateUserStatus", allUsers);
       } catch (err) {
         console.error("❌ Error updating user status:", err);
       }
     }
   });
 });
