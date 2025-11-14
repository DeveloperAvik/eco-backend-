const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, min: 1 },
    target: { type: String, default: "" },
    participants: { type: Number, default: 0, index: true },
    impactMetric: { type: String, default: "" },
    createdBy: { type: String, required: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
