import mongoose from "mongoose";
const Schema = mongoose.Schema;
const storeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Method to exclude the password
storeSchema.methods.toJSON = function () {
  const store = this.toObject();
  store.id = store._id;
  delete store._id;
  delete store.password;
  delete store.createdAt;
  delete store.updatedAt;
  return store;
};
export default mongoose.model("Store", storeSchema);
