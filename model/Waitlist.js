import mongoose from "mongoose";
const Schema = mongoose.Schema;
const waitListSchema = new Schema(
  {
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
