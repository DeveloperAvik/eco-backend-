const mongoose = require("mongoose");

const OffsetSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  method: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Offset", OffsetSchema);
