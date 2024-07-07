import express from "express";
import {
  createNewProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../../controllers/dashboard/productController.js";
import VerifyRoles from "../../../middleware/VerifyRole.js";
import ROLES_LIST from "../../../config/roles_list.js";
import fileUpload from "express-fileupload";
import fileExtLimiter from "../../../middleware/fileExtLimiter.js";
import fileSizeLimiter from "../../../middleware/fileSizeLimiter.js";
const router = express.Router();

router.route("/:storeId").get(getAllProducts).delete(deleteProduct);

router
  .route("/")
  .post(
    fileUpload({ createParentPath: true }),
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    createNewProduct
  )
  .put(
    fileUpload({ createParentPath: true }),
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    updateProduct
  );

router.route("/:storeId/:id").get(getProduct);
export default router;
