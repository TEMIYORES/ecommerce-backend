const express = require("express");
const handleUserAuth = require("../../controllers/authController");
const router = express.Router();

router.route("/").post(handleUserAuth);

module.exports = router;
