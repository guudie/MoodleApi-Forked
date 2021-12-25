const { Schema } = require("mongoose");
const connection = require("../modules/connection");

let courseDetailSchema = new Schema({
  course_id: String,
  intro: Object,
  chapters: Array,
});

let courseDetail = connection.model(
  "CourseDetail",
  courseDetailSchema,
  "course_detail"
);

module.exports = courseDetail;
