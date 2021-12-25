const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let courseCommentSchema = new Schema({
  course_id: String,
  comments: Array,
});

let courseComment = connection.model(
  "CourseComment",
  courseCommentSchema,
  "course_comment"
);

module.exports = courseComment;
