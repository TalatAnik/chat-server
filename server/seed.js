const mongoose = require("mongoose");
const User = require("./models/User");
const Message = require("./models/Message");

mongoose
  .connect(
    "mongodb+srv://pranxta007:hd5AD3uOMLDJixxb@cluster0.kjrip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedUsers = async () => {
  const users = [
    { username: "Alice", password: "alice123" },
    { username: "Bob", password: "bob123" },
    { username: "Charlie", password: "charlie123" },
  ];

  try {
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Users seeded");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

const seedMessages = async () => {
  const sender = await User.findOne({ username: "Alice" });
  const receiver = await User.findOne({ username: "Bob" });

  const messages = [
    { sender: sender._id, receiver: receiver._id, message: "Hello Bob!" },
    { sender: receiver._id, receiver: sender._id, message: "Hi Alice!" },
  ];

  try {
    await Message.deleteMany({});
    await Message.insertMany(messages);
    console.log("Messages seeded");
  } catch (error) {
    console.error("Error seeding messages:", error);
  }
};

const seedDatabase = async () => {
  await seedUsers();
  await seedMessages();
  mongoose.connection.close();
};

seedDatabase();
