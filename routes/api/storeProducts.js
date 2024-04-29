import express from "express";
import {
  getAllProducts,
  getFeaturedProduct,
  getRecentProducts,
  getSingleProduct,
} from "../../controllers/storeProductsController.js";

const router = express.Router();
router.route("/").post(getRecentProducts);
router.route("/all").post(getAllProducts);
router.route("/:id").post(getSingleProduct);
router.route("/featured/:id").post(getFeaturedProduct);

export default router;
