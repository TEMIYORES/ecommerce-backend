import express from "express";

import {
  createAccount,
  loginAccount,
} from "../../controllers/accountController.js";
import handleAccountRefreshToken from "../../controllers/accountRefreshTokenController.js";

const router = express.Router();
router.route("/create").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/refresh").get(handleAccountRefreshToken);

export default router;
