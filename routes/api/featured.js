import express from "express";
import {
  getAllFeaturedProducts,
  getFeaturedProduct,
  getFeaturedProducts,
} from "../../controllers/featuredController.js";

const router = express.Router();
router.route("/").get(getFeaturedProducts);
router.route("/all").get(getAllFeaturedProducts);
router.route("/:id").get(getFeaturedProduct);

export default router;
