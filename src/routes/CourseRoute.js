const express = require("express");
const router = express.Router();
const controller = require("../controllers/CourseController");
const validate = require("../validations/CourseValidate");

router.get("/", validate.list, controller.list);

module.exports = router;
