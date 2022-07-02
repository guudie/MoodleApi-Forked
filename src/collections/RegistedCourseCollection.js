const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let registedCourseSchema = new Schema({
  course_id: String,
  list: Array,
});

let registedCourse = connection.model(
  "RegistedCourse",
  registedCourseSchema,
  "register_course"
);

module.exports = registedCourse;
