import express from "express";

import {
  checkout,
  verifyCheckout,
} from "../../../controllers/store/checkoutController.js";

const router = express.Router();
router.route("/").post(checkout);
router.route("/verify").post(verifyCheckout);

export default router;
