import express from "express";
import {
  getAllReviews,
  saveReview,
} from "../../../controllers/store/reviewController.js";

const router = express.Router();
router.route("/:storeId/:productId").get(getAllReviews);
router.route("/").post(saveReview);

export default router;
