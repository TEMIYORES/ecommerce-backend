const express = require("express");

const VerifyRoles = require("../../middleware/VerifyRole");
const ROLES_LIST = require("../../config/roles_list");
const {
  createNewUpload,
  getUpload,
} = require("../../controllers/uploadController");
const fileUpload = require("express-fileupload");
const router = express.Router();
const filesPayloadExists = require("../../middleware/filesPayloadExists");
const fileExtLimiter = require("../../middleware/fileExtLimiter");
const fileSizeLimiter = require("../../middleware/fileSizeLimiter");
router
  .route("/:id")
  .get(VerifyRoles(ROLES_LIST.Admin), getUpload)
  .post(
    VerifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    createNewUpload
  );

module.exports = router;
