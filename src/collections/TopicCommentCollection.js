const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let topicCommentSchema = new Schema({
  topic_id: String,
  comments: Array,
});

let topicComment = connection.model(
  "TopicComment",
  topicCommentSchema,
  "topic_comment"
);

module.exports = topicComment;
