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
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// Method to exclude the password
accountSchema.methods.toJSON = function () {
  const account = this.toObject();
  account.id = account._id;
  delete account._id;
  delete account.password;
  delete account.createdAt;
  delete account.updatedAt;
  return account;
};

export default mongoose.model("Account", accountSchema);
