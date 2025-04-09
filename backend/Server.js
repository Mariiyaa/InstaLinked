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
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require("socket.io");
const http = require("http");
const User =require('./models/User')
const homesearchRoutes = require("./routes/homesearch")
const Message = require("./models/Message");
const feedRoutes = require("./routes/feed");
const followRoutes = require('./routes/followRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
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








 app.use("/api/homesearch", homesearchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api', personaRoutes);
app.use('/api', ContentSelectRoutes);
app.use('/api', CreatePostRoute);
app.use("/api/users", userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts',PostRoutes);
app.use("/api", feedRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);

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

     const { sender, receiver, message,isRead,sharedPost } = data;
     console.log("📩 Sending message:", data);
     const Message = require("./models/Message");
     const newMessage = new Message({ sender, receiver, message,isRead: false,sharedPost });
     
     await newMessage.save();
    

     io.emit("receiveMessage", {...data, _id: newMessage._id, isRead: false,sharedPost});

     const latestMessages = await getLatestMessages();
     io.emit("updateLatestMessages", latestMessages);
   });

   socket.on("new-message", (data) => {
    io.emit("new-message", data);
  });
  
  socket.on("mark-as-read", async ({ sender, receiver }) => {
    try {
      console.log("🟢 Incoming 'mark-as-read' request");
        console.log("📌 Current Socket ID:", socket.id);
        console.log("📌 Online Users Map:", onlineUsers);

        // 🔹 Retrieve user email correctly
        let userEmail = onlineUsers.get(socket.id);
        if (!userEmail) {
          // Try to get email from the receiver parameter
          userEmail = receiver;
          console.log("⚠️ Socket ID not found, attempting to re-register user:", userEmail);
          
          await ensureUserOnline(socket, userEmail);
          userEmail = onlineUsers.get(socket.id); // Get the email again after registration
        }
    
        if (!userEmail) {
          console.log("❌ User email is still undefined after registration attempt");
         
        }

        // ✅ Ensure only the receiver marks messages as read
        if (userEmail !== receiver) {
            console.log("❌ Only the receiver can mark messages as read.");
            return;
        }

        console.log(`📩 Marking messages as read from ${sender} to ${receiver}`);

        // ✅ Update unread messages from sender to receiver
        await Message.updateMany(
            { sender, receiver, isRead: false },
            { $set: { isRead: true } }
        );

        // 🔹 Fetch updated messages (only IDs & read status)
        const updatedMessages = await Message.find(
            { sender, receiver },
            { _id: 1, isRead: 1 }
        );

        console.log("✅ Updated Messages:", updatedMessages);

        // ✅ Notify sender about read messages
        const senderSocketId = onlineUsers.get(sender);
        if (senderSocketId) {
            io.to(senderSocketId).emit("message-read", { sender, receiver, updatedMessages });
        }

        // ✅ Update latest messages
        const latestMessages = await getLatestMessages();
       
        io.emit("updateLatestMessages", latestMessages);

    } catch (err) {
        console.error("❌ Error marking messages as read:", err);
    }
});

  
  socket.on("fetchLatestMessages", async () => {
    try {
      const latestMessages = await getLatestMessages();
      socket.emit("updateLatestMessages", latestMessages);
    } catch (error) {
      console.error("❌ Error fetching latest messages:", error);
    }
  });
   socket.on("userOnline", async (email) => {
     if (email) {
      for (const [key, value] of onlineUsers.entries()) {
        if (value === email || key === email) {
            onlineUsers.delete(key);
        }
    }

    // 🔹 Store the new socket ID
    onlineUsers.set(email, socket.id);
    onlineUsers.set(socket.id, email);

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


 const getLatestMessages = async () => {
  const users = await User.find();
  return Promise.all(
    users.map(async (user) => {
      // Get the latest message where the user is either the sender or receiver
      const lastMsg = await Message.findOne({
        $or: [{ sender: user.email }, { receiver: user.email }],
      })
        .sort({ createdAt: -1 })
        .select("message sender receiver isRead createdAt");

      if (!lastMsg) return { email: user.email, lastMessage: null, isUnread: null };

      const isUnread = !lastMsg.isRead; // ✅ True for both sender & receiver if not read

      return {
        email: user.email,
        lastMessage: lastMsg.message,
        isUnread, // ✅ True if the message is unread (for both sender & receiver)
      };
    })
  );
};

const ensureUserOnline = async (socket, email) => {
  if (!onlineUsers.has(email) || !onlineUsers.has(socket.id)) {
    // Cleanup any existing entries
    for (const [key, value] of onlineUsers.entries()) {
      if (value === email || key === email) {
        onlineUsers.delete(key);
      }
    }

    // Add new entries
    onlineUsers.set(email, socket.id);
    onlineUsers.set(socket.id, email);

    await User.updateOne({ email }, { $set: { isOnline: true } });
    const allUsers = await User.find({}, { email: 1, isOnline: 1 });
    io.emit("updateUserStatus", allUsers);
  }
};


