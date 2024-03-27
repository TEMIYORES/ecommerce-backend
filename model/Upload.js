import mongoose from "mongoose";
const Schema = mongoose.Schema;
const uploadSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productImages: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("Upload", uploadSchema);
