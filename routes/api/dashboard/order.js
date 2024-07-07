import express from "express";
import {
  getAllOrders,
  getOrder,
  getAllCustomerOrders,
} from "../../../controllers/dashboard/orderController.js";

const router = express.Router();
router.route("/").post(getAllCustomerOrders);
router.route("/:storeId").get(getAllOrders);
router.route("/:storeId/:id").get(getOrder);

export default router;
