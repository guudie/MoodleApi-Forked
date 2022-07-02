const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let registedUserSchema = new Schema({
  user_id: String,
  list: Array,
});

let registedUser = connection.model(
  "RegistedUser",
  registedUserSchema,
  "register_user"
);

module.exports = registedUser;
