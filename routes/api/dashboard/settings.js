import express from "express";
import {
  getSettings,
  handleSettings,
} from "../../../controllers/dashboard/SettingsController.js";

const router = express.Router();

router.route("/:storeId").get(getSettings);
router.route("/").post(handleSettings);

export default router;
