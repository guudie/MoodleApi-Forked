const express = require("express");
const router = express.Router();
const controller = require("../controllers/CourseController");
const validate = require("../validations/CourseValidate");

router.get("/", validate.list, controller.list);
router.get("/registered", validate.registered, controller.registered);
router.get("/related", validate.related, controller.related);
router.get("/detail", validate.detail, controller.detail);
router.get("/categories", validate.categories, controller.categories);

router.post("/register", validate.courseRegister, controller.courseRegister);
router.post(
  "/unregister",
  validate.courseUnregister,
  controller.courseUnregister
);
router.post("/edit", validate.edit, controller.edit);
router.post("/create", validate.create, controller.create);
router.post("/comment", validate.comment, controller.comment);
router.post("/edit-comment", validate.editComment, controller.editComment);
router.post(
  "/delete-comment",
  validate.deleteComment,
  controller.deleteComment
);
module.exports = router;
