import express from "express";
import { getAllCartProducts } from "../../controllers/cartController.js";

const router = express.Router();
router.route("/").post(getAllCartProducts);

export default router;
