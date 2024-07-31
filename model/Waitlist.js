import mongoose from "mongoose";
const Schema = mongoose.Schema;
const waitListSchema = new Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WaitList", waitListSchema);
