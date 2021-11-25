const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let courseSchema = new Schema({
  id: String,
  cate_id: String,
  title: String,
  short_title: String,
  description: String,
  image: String,
});

let course = connection.model("Course", courseSchema, "course");

module.exports = course;
