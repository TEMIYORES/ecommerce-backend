import express from "express";
import { checkAdminStore } from "../../controllers/adminController.js";

const router = express.Router();
router.route("/").get(checkAdminStore);
// router.route("/:id").get(getFeaturedProduct);

export default router;
