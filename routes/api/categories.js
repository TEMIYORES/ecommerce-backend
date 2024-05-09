import express from "express";
import {
  createNewCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/categoryController.js";
import VerifyRoles from "../../middleware/VerifyRole.js";
import ROLES_LIST from "../../config/roles_list.js";
const router = express.Router();

router
  .route("/:storeId")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllCategories)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewCategory)
  .put(VerifyRoles(ROLES_LIST.Admin), updateCategory)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteCategory);

router.route("/:storeId/:id").get(VerifyRoles(ROLES_LIST.Admin), getCategory);
export default router;
