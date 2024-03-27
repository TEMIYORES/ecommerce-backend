import express from "express";
import {
  createNewProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/productController.js";
import VerifyRoles from "../../middleware/VerifyRole.js";
import ROLES_LIST from "../../config/roles_list.js";
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllProducts)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewProduct)
  .put(VerifyRoles(ROLES_LIST.Admin), updateProduct)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteProduct);

router.route("/:id").get(VerifyRoles(ROLES_LIST.Admin), getProduct);
export default router;
