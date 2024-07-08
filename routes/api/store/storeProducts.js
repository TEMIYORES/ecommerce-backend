import express from "express";
import {
  getAllCategoryProducts,
  getAllProducts,
  getFeaturedProduct,
  getRecentProducts,
  getSearchProducts,
  getSingleCategoryProducts,
  getSingleProduct,
} from "../../../controllers/store/storeProductsController.js";

const router = express.Router();
router.route("/:storeId").get(getAllProducts);
router.route("/:storeId/recents").get(getRecentProducts);
router.route("/:storeId/featured").get(getFeaturedProduct);
router.route("/:storeId/categories").post(getAllCategoryProducts);
router
  .route("/:storeId/categories/:categoryName")
  .post(getSingleCategoryProducts);
router.route("/:storeId/search/:searchValue").post(getSearchProducts);
router.route("/:storeId/:id").get(getSingleProduct);

export default router;
