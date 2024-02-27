const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Connected "+mongoose.connection.host.bgGreen);
  } catch (error) {
    console.log("MongoDB Connection Error:", process.env.MONGO_URL.bgRed);
}
};

module.exports = connectDB;