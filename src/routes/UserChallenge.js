const mongoose = require("mongoose");

const UserChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    // NEW FIELDS — store user email + name from Firebase
    userEmail: {
      type: String,
      default: "",
    },

    userName: {
      type: String,
      default: "",
    },

    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Not Started"],
      default: "Ongoing",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // GAMIFICATION
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 1,
      min: 1,
    },

    level: {
      type: Number,
      default: 1,
    },

    lastActiveDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserChallenge", UserChallengeSchema);
