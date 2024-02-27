const express = require("express");
const {
  getAllUsers,
  createNewUser,
  updateUser,
  getUser,
  deleteUser,
} = require("../../controllers/userController");
const VerifyRoles = require("../../middleware/VerifyRole");
const ROLES_LIST = require("../../config/roles_list");
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllUsers)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewUser)
  .put(VerifyRoles(ROLES_LIST.Admin), updateUser)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:id").get(VerifyRoles(ROLES_LIST.Admin), getUser);

module.exports = router;
