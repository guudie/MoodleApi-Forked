const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let userSchema = new Schema({
  id: String,
  name: String,
  email: String,
  level: String, // 0: Student, 1: Teacher
  phone: String,
  date_birth: String,
  address: String,
});

let user = connection.model("User", userSchema, "user");

module.exports = user;
