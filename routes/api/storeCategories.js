import express from "express";
import {
  getAllStoreCategories,
  getCategory,
} from "../../controllers/storeCategoriesController.js";

const router = express.Router();
router.route("/:storeId").get(getAllStoreCategories);
router.route("/:storeId/:categoryName").get(getCategory);

export default router;
