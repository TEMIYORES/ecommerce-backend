import express from "express";
import {
  getAllCategoryProducts,
  getAllProducts,
  getFeaturedProduct,
  getFilterCategoryProducts,
  getRecentProducts,
  getSingleCategoryProducts,
  getSingleProduct,
} from "../../controllers/storeProductsController.js";

const router = express.Router();
router.route("/:storeId/products/recents").get(getRecentProducts);
router.route("/:storeId/products").get(getAllProducts);
router.route("/:storeId/products/categories").post(getAllCategoryProducts);
router
  .route("/:storeId/products/categories/:categoryName")
  .post(getSingleCategoryProducts);
router
  .route("/:storeId/products/categories/:categoryName")
  .post(getFilterCategoryProducts);
router.route("/:storeId/product/:id").get(getSingleProduct);
router.route("/:storeId/featured/:id").get(getFeaturedProduct);

export default router;
