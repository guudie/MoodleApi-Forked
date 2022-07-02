const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let categorySchema = new Schema({
  id: String,
  title: String,
  short_title: String,
  description: String,
  image: String,
});

let category = connection.model("Category", categorySchema, "category");

module.exports = category;
