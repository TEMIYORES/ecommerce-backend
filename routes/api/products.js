const express = require("express");
const {
  createNewProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController");
const VerifyRoles = require("../../middleware/VerifyRole");
const ROLES_LIST = require("../../config/roles_list");
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllProducts)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewProduct)
  .put(VerifyRoles(ROLES_LIST.Admin), updateProduct)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteProduct);

router.route("/:id").get(VerifyRoles(ROLES_LIST.Admin), getProduct);
module.exports = router;
