import express from "express";
import {
  getAddressData,
  saveAddressData,
} from "../../controllers/addressController.js";

const router = express.Router();
router.route("/create").put(saveAddressData);
router.route("/:storeId/:accountId").get(getAddressData);

export default router;
