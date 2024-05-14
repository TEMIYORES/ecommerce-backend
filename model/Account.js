import mongoose from "mongoose";
const Schema = mongoose.Schema;
const accountSchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    orderData: {
      type: Array,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      phone: String,
      details: {
        country: String,
        code: String,
        number: String,
      },
    },
    refreshToken: [String],
    roles: {
      User: {
        type: String,
        default: "5677",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Account", accountSchema);
