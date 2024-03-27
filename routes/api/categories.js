const express = require("express");
const {
  createNewCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController");
const VerifyRoles = require("../../middleware/VerifyRole");
const ROLES_LIST = require("../../config/roles_list");
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllCategories)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewCategory)
  .put(VerifyRoles(ROLES_LIST.Admin), updateCategory)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteCategory);

router.route("/:id").get(VerifyRoles(ROLES_LIST.Admin), getCategory);
module.exports = router;
