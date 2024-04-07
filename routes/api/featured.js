import express from "express";
import {
  getAllRecentProducts,
  getFeaturedProduct,
} from "../../controllers/featuredController.js";

const router = express.Router();
router.route("/").get(getAllRecentProducts);
router.route("/:id").get(getFeaturedProduct);

export default router;
