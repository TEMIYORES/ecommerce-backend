import express from "express";
import handleWaitlist from "../../controllers/waitlistController.js";
const router = express.Router();

router.route("/").post(handleWaitlist);

export default router;
