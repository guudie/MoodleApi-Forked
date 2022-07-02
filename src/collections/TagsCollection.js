const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let tagsSchema = new Schema({
  id: String,
  name: String,
});

let tags = connection.model("Tags", tagsSchema, "tags");

module.exports = tags;
