import express from "express";
import {
  getAllFeaturedProducts,
  getFeaturedProduct,
  getFeaturedProducts,
} from "../../controllers/featuredController.js";

const router = express.Router();
router.route("/").get(getFeaturedProducts);
router.route("/products").get(getAllFeaturedProducts);
router.route("/products/:id").get(getSingleProduct);
router.route("/:id").get(getFeaturedProduct);

export default router;
