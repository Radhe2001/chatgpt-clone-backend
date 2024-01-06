const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    question: { type: String, required: true},
    answer: { type: String, required: true },
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

module.exports = mongoose.model("messages", messageSchema);
