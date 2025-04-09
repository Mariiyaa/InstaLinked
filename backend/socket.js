const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      try {
        // Broadcast the message to all connected clients
        io.emit('receiveMessage', messageData);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}; 