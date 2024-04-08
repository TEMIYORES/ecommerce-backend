import express from "express";
import { getAllOrders } from "../../controllers/orderController.js";

const router = express.Router();
router.route("/").get(getAllOrders);
// router.route("/:id").get(getFeaturedProduct);

export default router;
