import express from "express";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  getUser,
  deleteUser,
} from "../../controllers/userController.js";
import VerifyRoles from "../../middleware/VerifyRole.js";
import ROLES_LIST from "../../config/roles_list.js";
const router = express.Router();

router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllUsers)
  .post(VerifyRoles(ROLES_LIST.Admin), createNewUser)
  .put(VerifyRoles(ROLES_LIST.Admin), updateUser)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:id").get(getUser);

export default router;
