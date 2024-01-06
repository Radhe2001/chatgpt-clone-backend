const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatSchema);
