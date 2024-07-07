import express from "express";
import { getStore } from "../../../controllers/dashboard/storeAccountController.js";

const router = express.Router();

router.route("/:id").get(getStore);

export default router;
