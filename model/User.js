const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  roles: {
    User: {
      type: String,
      default: "8901",
    },
    Editor: String,
    Admin: String,
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

module.exports = mongoose.model("User", userSchema);
