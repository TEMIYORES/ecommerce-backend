const express = require("express");
const handleNewUser = require("../../controllers/registerController");
const router = express.Router();

router.route("/").post(handleNewUser);

module.exports = router