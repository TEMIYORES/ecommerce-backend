import express from "express";
import {
  getAllStoreCategories,
  getCategory,
} from "../../controllers/storeCategoriesController.js";

const router = express.Router();
router.route("/:storeId/categories").get(getAllStoreCategories);
router.route("/:storeId/categories/:categoryName").get(getCategory);

export default router;
