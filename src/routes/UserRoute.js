const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const validate = require("../validations/UserValidate");

router.get("/profile", validate.profile, controller.profile);

module.exports = router;
