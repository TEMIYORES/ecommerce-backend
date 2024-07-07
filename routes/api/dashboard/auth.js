import express from "express";
import registerStore from "../../../controllers/dashboard/auth/registerController.js";
import {
  loginStore,
  verifyAccount,
} from "../../../controllers/dashboard/auth/loginController.js";
import updateStore from "../../../controllers/dashboard/auth/updateController.js";

const router = express.Router();
router.route("/:email").get(verifyAccount);
router.route("/update").put(updateStore);
router.route("/register").post(registerStore);
router.route("/login").post(loginStore);

export default router;
