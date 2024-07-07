import express from "express";
import {
  createNewCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../../../controllers/dashboard/categoryController.js";
const router = express.Router();

router
  .route("/:storeId")
  .get(getAllCategories)
  .post(createNewCategory)
  .put(updateCategory)
  .delete(deleteCategory);

router.route("/:storeId/:id").get(getCategory);
export default router;
