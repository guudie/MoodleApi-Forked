const express = require("express");
const router = express.Router();
const user = require("../collections/UserCollection");
const controller = require("../controllers/AuthController");

router.post("/login", controller.login);

router.post("/register", controller.register);

module.exports = router;
