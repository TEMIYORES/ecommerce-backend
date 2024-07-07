import express from "express";

import {
  createAccount,
  loginAccount,
  updateAccount,
  verifyAccount
} from "../../../controllers/store/accountController.js";

const router = express.Router();
router.route("/:email").post(verifyAccount);
router.route("/register").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/update").put(updateAccount);

export default router;
