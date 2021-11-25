const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let accountSchema = new Schema({
  id: String,
  password: String,
  otp: String,
});

let account = connection.model("Account", accountSchema, "account");

module.exports = account;
