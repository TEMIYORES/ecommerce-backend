import express from "express";
import {
  getAllStore,
  updateStore,
  getStore,
  deleteStore,
} from "../../controllers/storeController.js";
import VerifyRoles from "../../middleware/VerifyRole.js";
import ROLES_LIST from "../../config/roles_list.js";
const router = express.Router();
router
  .route("/")
  .get(VerifyRoles(ROLES_LIST.Admin), getAllStore)
  .put(VerifyRoles(ROLES_LIST.Admin), updateStore)
  .delete(VerifyRoles(ROLES_LIST.Admin), deleteStore);

router.route("/:id").get(getStore);

export default router;
