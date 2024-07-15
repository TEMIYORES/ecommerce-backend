import mongoose from "mongoose";
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
  },
  reviews: [
    {
      rating: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Review", reviewSchema);
