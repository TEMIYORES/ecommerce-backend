import express from "express";
import handleStoreAuth from "../../controllers/authController.js";
const router = express.Router();

router.route("/").post(handleStoreAuth);

export default router;
