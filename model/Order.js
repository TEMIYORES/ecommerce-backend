import mongoose from "mongoose";
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    orderData: {
      type: Object,
      required: true,
    },
    customerInformation: {
      type: Object,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
