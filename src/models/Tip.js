const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, maxlength: 600 },
    category: { type: String, default: "General", index: true },
    author: { type: String, required: true }, // email or uid
    authorName: { type: String, default: "Eco User" },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tip", TipSchema);
