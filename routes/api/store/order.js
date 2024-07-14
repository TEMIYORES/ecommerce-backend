import express from "express";
import {
  getAllCustomerOrders,
} from "../../../controllers/store/orderController.js";

const router = express.Router();
router.route("/").post(getAllCustomerOrders);

export default router;
