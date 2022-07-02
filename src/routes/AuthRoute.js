const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");
const validate = require("../validations/AuthValidate");

router.post("/login", validate.login, controller.login);

router.post("/register", validate.register, controller.register);

module.exports = router;
