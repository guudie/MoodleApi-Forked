const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let topicSchema = new Schema({
  id: String,
  title: String,
  description: String,
  content: String,
  author: String,
  tags: Array,
  date: String,
  likes: Array,
});

let topic = connection.model("Topic", topicSchema, "topic");

module.exports = topic;
