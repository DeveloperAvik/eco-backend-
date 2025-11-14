const mongoose = require("mongoose");

const CarbonLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true }, // grams
    category: { type: String, required: true, index: true },
    meta: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("CarbonLog", CarbonLogSchema);
