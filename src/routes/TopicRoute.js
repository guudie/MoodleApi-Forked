const express = require("express");
const router = express.Router();
const controller = require("../controllers/TopicController");
const validate = require("../validations/TopicValidate");

router.get("/", validate.list, controller.list);
router.get("/detail", validate.detail, controller.detail);
router.get("/tags", validate.tags, controller.tags);
router.get("/comments", validate.getComments, controller.getComments);

router.post("/edit", validate.edit, controller.edit);
router.post("/create", validate.create, controller.create);
router.post("/comment", validate.comment, controller.comment);
router.post("/edit-comment", validate.editComment, controller.editComment);
router.post(
  "/delete-comment",
  validate.deleteComment,
  controller.deleteComment
);

router.post("/like", validate.like, controller.like);
router.post("/unlike", validate.unlike, controller.unlike);

module.exports = router;
