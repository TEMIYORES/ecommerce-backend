import express from "express";
import handleUserAuth from "../../controllers/authController.js";
const router = express.Router();

router.route("/").post(handleUserAuth);

export default router;
