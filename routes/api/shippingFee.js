import express from "express";
import { getShippingFee } from "../../controllers/dashboard/SettingsController.js";
const router = express.Router();

router.route("/:storeId/:state").get(getShippingFee);

export default router;
