const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").post(authController.protect, blogController.createBlog).get(blogController);

module.exports = router;
