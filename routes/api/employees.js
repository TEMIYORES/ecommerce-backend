import express from "express";
import {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} from "../../controllers/employeeController.js";
import roles_list from "../../config/roles_list.js";
import VerifyRoles from "../../middleware/VerifyRole.js";

const router = express.Router();

router
  .route("/")
  .get(
    VerifyRoles(roles_list.Admin, roles_list.Editor, roles_list.User),
    getAllEmployees
  )
  .post(VerifyRoles(roles_list.Admin, roles_list.Editor), createNewEmployee)
  .put(VerifyRoles(roles_list.Admin, roles_list.Editor), updateEmployee)
  .delete(VerifyRoles(roles_list.Admin), deleteEmployee);
router.route("/:id").get(getEmployee);

export default router;
