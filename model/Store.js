import mongoose from "mongoose";
const Schema = mongoose.Schema;
const storeSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: String,
      default: "8901",
    },
    Editor: String,
    Admin: {
      type: String,
      default: "1234",
    },
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  refreshToken: [String],
});

export default mongoose.model("Store", storeSchema);
