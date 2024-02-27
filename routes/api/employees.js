const express = require("express");
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employeeController");
const router = express.Router();
const roles_list = require("../../config/roles_list");
const VerifyRoles = require("../../middleware/VerifyRole");
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
module.exports = router;
