const mongoose = require("mongoose");

const OffsetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    method: {
      type: String,
      required: true,
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offset", OffsetSchema);
