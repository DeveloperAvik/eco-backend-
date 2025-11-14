const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  author: String,
  authorName: String,
  upvotes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Tip", TipSchema);
