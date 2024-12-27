io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins (map token to socket ID)
  socket.on("join", (password) => {
    onlineUsers.set(password, socket.id);
    console.log(`User with token ${password} joined.`);
  });

  // Handle message sending
  socket.on("sendMessage", async ({ senderToken, receiverToken, message }) => {
    try {
      const sender = await User.findOne({ password: senderToken });
      const receiver = await User.findOne({ password: receiverToken });

      if (!sender || !receiver) return;

      // Save message to database
      const newMessage = new Message({
        sender: sender._id,
        receiver: receiver._id,
        message,
      });
      await newMessage.save();

      // Deliver message in real-time if receiver is online
      const receiverSocketId = onlineUsers.get(receiverToken);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          sender: sender.username,
          message,
          timestamp: newMessage.timestamp,
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
    console.log("A user disconnected:", socket.id);
  });
});
