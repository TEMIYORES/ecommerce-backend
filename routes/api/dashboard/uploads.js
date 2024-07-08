import express from "express";

import {
  createNewUpload,
  getUpload,
} from "../../../controllers/dashboard/uploadController.js";
import fileUpload from "express-fileupload";
import filesPayloadExists from "../../../middleware/filesPayloadExists.js";
import fileExtLimiter from "../../../middleware/fileExtLimiter.js";
import fileSizeLimiter from "../../../middleware/fileSizeLimiter.js";
const router = express.Router();
router
  .route("/:id")
  .get(getUpload)
  .post(
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    createNewUpload
  );

export default router;
