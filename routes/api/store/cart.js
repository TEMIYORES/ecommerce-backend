import express from "express";
import { getAllCartProducts } from "../../../controllers/store/cartController.js";

const router = express.Router();
router.route("/").post(getAllCartProducts);

export default router;
