import mongoose from "mongoose";
const Schema = mongoose.Schema;
const addressSchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", addressSchema);
