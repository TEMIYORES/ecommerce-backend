import mongoose from "mongoose";
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  storeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  properties: [{ type: Object }],
});

export default mongoose.model("Category", categorySchema);
