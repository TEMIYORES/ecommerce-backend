import express from "express";

import VerifyRoles from "../../middleware/VerifyRole.js";
import ROLES_LIST from "../../config/roles_list.js";
import {
  createNewUpload,
  getUpload,
} from "../../controllers/uploadController.js";
import fileUpload from "express-fileupload";
import filesPayloadExists from "../../middleware/filesPayloadExists.js";
import fileExtLimiter from "../../middleware/fileExtLimiter.js";
import fileSizeLimiter from "../../middleware/fileSizeLimiter.js";
const router = express.Router();
router
  .route("/:id")
  .get(VerifyRoles(ROLES_LIST.Admin), getUpload)
  .post(
    VerifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    createNewUpload
  );

export default router;
