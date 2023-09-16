const mongoose = require("mongoose");

async function connectDb() {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDb;
