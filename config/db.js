const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo DB connected!!");
  } catch (err) {
    console.log(`MongoDB connection failed: ${err.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
