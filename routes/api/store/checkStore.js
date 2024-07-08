import express from "express";
import { checkStore } from "../../../controllers/store/checkStoreController.js";

const router = express.Router();
router.route("/:subdomain").get(checkStore);
// router.route("/:id").get(getFeaturedProduct);

export default router;
