const mongoose = require("mongoose");

async function connectDatabase(uri) {
  try {
    const connection = await mongoose.connect(uri);
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = { connectDatabase };
