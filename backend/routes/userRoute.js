const express = require("express");
const authContoller = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(authContoller.signup);
router.route("/login").post(authContoller.login);

module.exports = router;
