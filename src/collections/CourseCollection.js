const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let courseSchema = new Schema({
  id: String,
  name: String,
  description: String,
  type: String,
});

let course = connection.model("Course", courseSchema, "course");

module.exports = course;