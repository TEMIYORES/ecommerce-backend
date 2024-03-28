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
import fileUpload from "express-fileupload";
import filesPayloadExists from "../../middleware/filesPayloadExists.js";
import fileExtLimiter from "../../middleware/fileExtLimiter.js";
import fileSizeLimiter from "../../middleware/fileSizeLimiter.js";
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllProducts)
  .post(
    VerifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    createNewProduct
  )
  .put(
    VerifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    updateProduct
  )
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteProduct);

router.route("/:id").get(VerifyRoles(ROLES_LIST.Admin), getProduct);
export default router;
