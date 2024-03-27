import mongoose from "mongoose";
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

export default mongoose.model("Category", categorySchema);
