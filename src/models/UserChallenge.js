const mongoose = require("mongoose");

const UserChallengeSchema = new mongoose.Schema({
  userId: String,
  challengeId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "Not Started" },
  progress: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("UserChallenge", UserChallengeSchema);
