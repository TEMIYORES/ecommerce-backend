import mongoose from "mongoose";
const Schema = mongoose.Schema;
const wishListSchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WishList", wishListSchema);
