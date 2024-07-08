import express from "express";
import {
  getWishListIds,
  getWishListProducts,
  saveWishProduct,
} from "../../../controllers/store/wishListController.js";

const router = express.Router();
router.route("/").post(saveWishProduct);
router.route("/ids").post(getWishListIds);
router.route("/products").post(getWishListProducts);

export default router;
