const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const validate = require("../validations/UserValidate");

router.get("/profile", validate.profile, controller.profile);
router.get("/otp", validate.otp, controller.otp);

router.post("/edit", validate.edit, controller.edit);
router.post(
  "/changePassword",
  validate.changePassword,
  controller.changePassword
);
router.post("/changeEmail", validate.changeEmail, controller.changeEmail);

module.exports = router;
