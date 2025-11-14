const mongoose = require("mongoose");

const CarbonLogSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  category: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CarbonLog", CarbonLogSchema);
