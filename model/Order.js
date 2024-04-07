import mongoose from "mongoose";
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    orderData: Object,
    customerInformation: Object,
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
