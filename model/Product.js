import mongoose from "mongoose";
const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
  },
  productImages: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("Product", productSchema);
