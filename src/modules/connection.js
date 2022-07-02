const mongoose = require("mongoose");

const URI = "mongodb+srv://admin:123456As@cluster0.vrwba.mongodb.net/StudyData?retryWrites=true&w=majority";

let connection = {};

try {
  // Connect to the MongoDB cluster
  connection = mongoose.createConnection(URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log(" Mongoose is connected");
  });
} catch (e) {
  console.log("could not connect", e);
}

module.exports = connection;
