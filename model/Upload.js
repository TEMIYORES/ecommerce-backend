const mongoose = require("mongoose");
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

module.exports = mongoose.model("Upload", uploadSchema);
